import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

// Pfad zum Verzeichnis, das die NZB-Dateien enthält
const dirPath: string = './nzbs';

// Pfad zum Verzeichnis, in das die archivierten NZB-Dateien verschoben werden sollen
const archiveDirPath: string = './nzbArchive';

// Stellen Sie sicher, dass das Archiv-Verzeichnis existiert, erstellen Sie es sonst
if (!fs.existsSync(archiveDirPath)) {
    fs.mkdirSync(archiveDirPath, { recursive: true });
}

// MongoDB URL - Stellen Sie sicher, dass die URL und der Port korrekt sind.
const url: string = 'mongodb://root:example@localhost:27017';

// Name der Datenbank und Sammlung
const dbName: string = 'media_cms';
const colName: string = 'movies';

// Funktion, um Dateinamen zu extrahieren und in die MongoDB einzufügen
const insertNZBIntoMongo = async (): Promise<void> => {
  const client: MongoClient = new MongoClient(url);

  try {
    // Verbindung zu MongoDB
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection(colName);
    
    // Lese alle Dateien im Ordner
    const files: string[] = fs.readdirSync(dirPath);

    for (const file of files) {
      if (file.endsWith('.nzb')) {
        const match = file.match(/(.+)_\((\d{4})\)\.nzb/);
        if (match && match.length > 2) {
          const name: string = match[1].replace(/_/g, ' ');
          const year: string = match[2];

          // Lese den Inhalt der NZB-Datei als Text
          const filePath: string = path.join(dirPath, file);
          const fileData: string = fs.readFileSync(filePath, { encoding: 'utf-8' });

          // Erstelle ein Dokument für MongoDB
          const document: { name: string, year: string, nzbContent: string } = {
            name,
            year,
            nzbContent: fileData
          };

          // Füge das Dokument in die MongoDB Sammlung ein
          await collection.insertOne(document);

          // Verschiebe die NZB-Datei in den Archiv-Ordner
          const newFilePath: string = path.join(archiveDirPath, file);
          fs.renameSync(filePath, newFilePath);
        }
      }
    }
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    // Schließe die Verbindung
    await client.close();
    console.log('MongoDB connection closed');
  }
};

// Führe die Funktion aus
insertNZBIntoMongo();

