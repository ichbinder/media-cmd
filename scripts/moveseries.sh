#!/bin/bash

REMOTE_PATH="gcrypt_plex:tv" # Remote Pfad in rclone für den Serien-Ordner
LOCAL_DOWNLOAD_PATH="/root/mnt/downloads" # Lokaler Pfad zum Speichern der heruntergeladenen Seasons
LOG_FILE="/root/mnt/log/rclone-download.log"

start_downloading=false # Flag, um den Startpunkt zu kontrollieren

# Durchlaufe jeden Serien-Hauptordner
rclone lsf "$REMOTE_PATH" --dirs-only | while read serie; do
    echo "Bearbeite Serie: $serie"

    # Beginne mit dem Herunterladen ab "She_Ra_Prinzessin_Der_Macht"
    if [[ "$serie" == "She_Ra_Prinzessin_Der_Macht/" ]]; then
        start_downloading=true
    fi
    
    # Wenn das Flag noch false ist, überspringe die Serie
    if [[ "$start_downloading" == false ]]; then
        continue
    fi

    # Durchlaufe jeden Season-Unterordner
    rclone lsf "$REMOTE_PATH/$serie" --dirs-only | grep 'Season_' | while read season; do
        echo "Beginne mit dem Herunterladen von $season aus der Serie $serie"

        # Einzelner rclone copy Befehl, um den Season-Ordner herunterzuladen
        rclone move "$REMOTE_PATH/$serie/$season" "$LOCAL_DOWNLOAD_PATH/$serie/$season" --progress -v --log-file=$LOG_FILE

        # Nach erfolgreichem Download, überprüfe, ob der Ordner leer ist
        if [ -z "$(ls -A "$LOCAL_DOWNLOAD_PATH/$serie/$season")" ]; then
            echo "Download von $season ist leer. Lösche leeren Ordner..."
            # Löscht den leeren Season-Ordner
            rmdir "$LOCAL_DOWNLOAD_PATH/$serie/$season"
        else
	    mkdir /root/mnt/nzb/$serie
            echo "Download von $season abgeschlossen."
            # Hier kann der Code eingefügt werden, um das Heruntergeladene weiter zu verarbeiten oder hochzuladen
	    /root/ngpost.sh --auto $LOCAL_DOWNLOAD_PATH/$serie --rm_posted --disp_progress FILES -o /root/mnt/nzb/$serie -g a.b.hdtv --gen_from --tmp_dir /root/mnt/tmp/ --gen_name --gen_pass --length_pass 23 --compress
        fi
    done
done
