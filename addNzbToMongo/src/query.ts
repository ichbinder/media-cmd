import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const url: string | undefined = process.env.MONGODB_URL;

if (!url) {
  throw new Error('Please define the environment variable MONGODB_URL.');
}

const client = new MongoClient(url);


// Der Name der Datenbank
const dbName = 'media_cms';

// Die Funktion, um Dokumente zu finden, bei denen `versions` mehr als einen Eintrag hat
async function findDocumentsWithMultipleVersions() {
  try {
    // Verbindung zur MongoDB-Datenbank herstellen
    await client.connect();
    console.log('Verbunden mit MongoDB');

    // Wähle die Datenbank
    const db = client.db(dbName);

    // Wähle die Collection
    const collection = db.collection('movies');

    // Führe die Aggregationspipeline aus
    const documents = await collection.aggregate([
        {
          $match: {
            versions: { $exists: true, $ne: [] } // Nicht-leeres Array
          }
        },
        {
          $project: {
            numberOfVersions: { $size: "$versions" },
            tmdbId: 1 // Behalte das tmdbId-Feld bei
          }
        },
        {
          $match: {
            numberOfVersions: { $gt: 1 }
          }
        }
      ]).toArray();
      
    // Gib die gefundenen Dokumente aus
    console.log(documents);
  } catch (error) {
    console.error('Fehler bei der Abfrage:', error);
  } finally {
    // Schließe die Verbindung zur Datenbank
    await client.close();
    console.log('Verbindung zu MongoDB geschlossen');
  }
}

// Rufe die Funktion auf
findDocumentsWithMultipleVersions();
