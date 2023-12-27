#!/bin/bash

REMOTE_PATH="gcrypt_plex:movies" # Remote Pfad in rclone für den Movie-Ordner
LOCAL_DOWNLOAD_PATH="/root/mnt/downloads" # Lokaler Pfad zum Speichern der heruntergeladenen Movies
TMP_DOWNLOAD_PATH="/root/mnt/tmp_download" # Temporärer Pfad für laufende Downloads
LOG_FILE_DOWNLOAD="/root/mnt/log/rclone-download.log"
LOG_FILE_UPLOAD="/root/mnt/log/ngpost-upload.log"
DOWNLOADED_MOVIES_FILE="/root/mnt/downloaded_movies.txt"
NGPOST_SCRIPT="/root/ngpost.sh" # Pfad zu Ihrem ngPost-Skript
NZB_OUTPUT_DIR="/root/mnt/nzb" # Pfad zur Speicherung der NZB-Dateien
TMP_DIR="/root/mnt/tmp" # Temporäres Verzeichnis für ngPost
UPLOAD_GROUPS="a.b.hdtv" # Die Newsgroups, in denen Sie posten möchten
START_POINT="G" # Beginne mit Filmen, die mit G oder später im Alphabet beginnen
MAX_MOVIES=10 # Maximale Anzahl von Filmen im Download-Verzeichnis

touch "$DOWNLOADED_MOVIES_FILE"


download_movies() {
    local start_downloading=false # Ein Flag zum Bestimmen, wann wir mit dem Herunterladen beginnen sollen

	while true; do
		# Liste der Filme ab dem Buchstaben "G" aus der Fernbedienung holen
		local movie_list=$(rclone lsf "$REMOTE_PATH" --dirs-only | grep -E "^[$START_POINT-Z]")
		echo $movie_list
		echo "MAX_DOWNLOADS ist gesetzt auf: $MAX_DOWNLOADS" # Debugging-Ausgabe

		for movie in $movie_list; do
			# Wenn wir "Invasion_(2020)" erreicht haben, setzen wir das Flag auf true
			if [[ "$movie" == "Invasion_(2020)" ]]; then
				start_downloading=true
			fi

			# Wenn das Flag false ist, überspringen wir alle Filme bis "Invasion_(2020)"
			if [[ "$start_downloading" == false ]]; then
				continue
			fi

			# Prüfe, ob der Film bereits heruntergeladen wurde oder derzeit heruntergeladen wird
			if [[ -d "$LOCAL_DOWNLOAD_PATH/$movie" || -d "$TMP_DOWNLOAD_PATH/$movie" ]]; then
				continue # überspringe, wenn der Film schon da ist
			fi

			# Überprüfe, ob der Film bereits heruntergeladen wurde
			if grep -q "^$movie$" "$DOWNLOADED_MOVIES_FILE"; then
				continue # Überspringe diesen Film, da er bereits heruntergeladen wurde
			fi

			# Warte, bis weniger als die maximale Anzahl von Filmen vorhanden ist
			local dir_count
			while : ; do
				dir_count=$(find "$LOCAL_DOWNLOAD_PATH" -mindepth 1 -maxdepth 1 -type d | wc -l)
				echo "Anzahl heruntergeladener Filme: $dir_count" # Debugging-Ausgabe
				if [[ "$dir_count" -lt "$MAX_DOWNLOADS" ]]; then
					echo "Weniger als $MAX_DOWNLOADS Filme gefunden, fahre fort..." # Debugging-Ausgabe
					break # Fährt fort, wenn Platz verfügbar ist
				else
					echo "Warte, da $MAX_DOWNLOADS Filme erreicht sind..." # Debugging-Ausgabe
				fi
				sleep 10 # Warte 10 Sekunden, bevor du es erneut versuchst
			done
			# Herunterladen des Films
			echo "Bearbeite Movie: $movie" >> "$DOWNLOADED_MOVIES_FILE" 
			#mkdir -p "$TMP_DOWNLOAD_PATH/$movie"
			rclone move "$REMOTE_PATH/$movie/" "$TMP_DOWNLOAD_PATH/$movie/" --progress -v --log-file="$LOG_FILE_DOWNLOAD"
			# Verschiebe den fertigen Download in das eigentliche Download-Verzeichnis
			mv "$TMP_DOWNLOAD_PATH/$movie" "$LOCAL_DOWNLOAD_PATH/"
			echo "$movie" >> "$DOWNLOADED_MOVIES_FILE" # Vermerk, dass der Film heruntergeladen wurde

		done
		sleep 60 # Kurze Pause vor der nächsten Überprüfung
	done
}


upload_movies() {
    /root/ngpost.sh --monitor "/root/mnt/downloads" --rm_posted --disp_progress FILES -o "/root/mnt/nzb/" -g "a.b.hdtv" --gen_from --tmp_dir "/root/mnt/tmp/" --gen_name --gen_pass --length_pass 23 --compress
}

# Funktion, die aufgerufen wird, wenn das Skript beendet wird
cleanup() {
	echo "Skript wird beendet, säubere Hintergrundprozesse..."
	# Beende alle Hintergrundjobs dieses Skripts
	pkill -P $$
	exit
}

# Fange SIGINT (Ctrl+C) und SIGTERM Signale ab und rufe cleanup auf
trap cleanup SIGINT SIGTERM

# Startet die Download- und Upload-Funktionen im Hintergrund
download_movies &
upload_movies &

# Warte auf die Hintergrundprozesse
wait
