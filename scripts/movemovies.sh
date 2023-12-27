#!/bin/bash

REMOTE="gcrypt_plex:movies" # Ersetzen durch den rclone Pfad zu Ihren Daten
DOWNLOAD_DIR="/root/mnt/downloads"
UPLOAD_DIR="/root/mnt/uploads"
MAX_SIZE="200G" # Maximalgröße für den Download
LOG_FILE="/root/mnt/log/rclone-download.log"

# Stellt sicher, dass das Log-File existiert
touch $LOG_FILE

while true; do
  # Prüfung, ob das Upload-Verzeichnis leer ist
  if [ -z "$(ls -A $UPLOAD_DIR)" ]; then
    echo "Starte Verschieben von Daten aus Cloud: $(date)" | tee -a $LOG_FILE
    # Verschiebe Daten von Cloud auf die lokale SSD und protokolliere die Ausgabe
    rclone move --cutoff-mode=soft --max-transfer=$MAX_SIZE $REMOTE $DOWNLOAD_DIR --progress -v --log-file=$LOG_FILE

    # Finde alle Unterordner im Download-Verzeichnis, die kleiner als 500MB sind und lösche sie
    #find $DOWNLOAD_DIR/* -type d -size -500M -exec rm -rf {} \;
    #find $DOWNLOAD_DIR/* -empty -type d -delete
    # Geht durch jedes Verzeichnis in der ersten Ebene von DOWNLOAD_DIR
    for dir in $DOWNLOAD_DIR/*/; do
      dir_size=$(du -sm "$dir" | cut -f1) # Ermittelt die Größe des Ordners in MB
      if [ $dir_size -lt 500 ]; then  # Wenn die Größe kleiner als 500MB ist,
        rm -rf "$dir"                 # löscht den Ordner
        #rclone purge $REMOTE/$dir --progress -v --log-file=$LOG_FILE
        #rclone rmdirs $REMOTE/$dir --progress -v --log-file=$LOG_FILE
        #rclone rmdir $REMOTE/$dir --progress -v --log-file=$LOG_FILE
        rclone delete gcrypt_plex:"$dir" --progress -v --log-file=$LOG_FILE
        echo "Ordner $dir ist kleiner als 500MB und wurde gelöscht: $(date)" | tee -a $LOG_FILE
      fi
    done

    echo "Verschiebung abgeschlossen. Verschiebe Daten von $DOWNLOAD_DIR nach $UPLOAD_DIR: $(date)" | tee -a $LOG_FILE
    # Verschiebe die heruntergeladenen Daten zum Upload-Verzeichnis
    mv $DOWNLOAD_DIR/* $UPLOAD_DIR/ >>$LOG_FILE 2>&1

    echo "Alle Bewegungen abgeschlossen: $(date)" | tee -a $LOG_FILE

    # Überprüfung, ob alles in UPLOAD_DIR korrekt verschoben wurde
    if [ -z "$(ls -A $DOWNLOAD_DIR)" ]; then
      echo "$DOWNLOAD_DIR ist leer. Nächste Runde kann starten: $(date)" | tee -a $LOG_FILE
    else
      echo "Warnung: $DOWNLOAD_DIR ist nicht leer. Überprüfe Dateien: $(date)" | tee -a $LOG_FILE
    fi

  else
    echo "$UPLOAD_DIR ist nicht leer. Warte für 30 Sekunden: $(date)" | tee -a $LOG_FILE
  fi
  # Warte 30 Sekunden vor der nächsten Prüfung
  sleep 30
done