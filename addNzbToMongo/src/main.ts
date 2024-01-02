import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import readline from 'readline';
import crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const tmdbApiKey: string | undefined = process.env.TMDB_API_KEY;

if (!tmdbApiKey) {
    throw new Error('Please define the environment variable TMDB_API_KEY.');
}

const url: string | undefined = process.env.MONGODB_URL;

if (!url) {
  throw new Error('Please define the environment variable MONGODB_URL.');
}

// Konfiguration
const dirPath: string = './nzbs';
const archiveDirPath: string = './nzbArchive';
const dbName: string = 'media_cms';
const colName: string = 'movies';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askUser = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (input) => resolve(input));
  });
};

const searchTmdb = async (name: string, year: string): Promise<any> => {
  const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
    params: {
      query: name,
      year: year
    },
    headers: {
      'Authorization': `Bearer ${tmdbApiKey}`
    }
  });
  return response.data.results;
};

const createFileHash = (filePath: string): string => {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
};

const searchTmdbWithManualEntry = async (originalName: string, year: string): Promise<any> => {
  let movies = await searchTmdb(originalName, year);
  if (movies.length === 0) {
    console.log(`Keine Filme gefunden für: ${originalName} (${year})`);
    let newName = await askUser('Geben Sie einen anderen Filmtitel ein, drücken Sie Enter, um zu überspringen, oder geben Sie "manual" ein, um einen Titel manuell festzulegen: ');
    if (newName.toLowerCase() === 'manual') {
      newName = await askUser('Geben Sie den gewünschten Titel ein: ');
      return [{ title: newName, manualEntry: true, year: year }];
    } else if (newName) {
      movies = await searchTmdb(newName, year);
    }
  }
  return movies;
};

const insertNZBIntoMongo = async (): Promise<void> => {
  const client: MongoClient = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection(colName);

    const files: string[] = fs.readdirSync(dirPath);

    for (const file of files) {
      if (file.endsWith('.nzb')) {
        const match = file.match(/(.+)_\((\d{4})\)\.nzb/);
        if (match && match.length > 2) {
          const name: string = match[1].replace(/_/g, ' ');
          const year: string = match[2];

          const movies = await searchTmdbWithManualEntry(name, year);

          if (movies.length > 0) {
            const selectedMovie = movies[0];
            const nzbFilePath = path.join(dirPath, file);
            const fileHash = createFileHash(nzbFilePath);

            const existingVersion = await collection.findOne({
              'versions.hash': fileHash
            });

            if (!existingVersion) {
              const nzbContent = fs.readFileSync(nzbFilePath, { encoding: 'utf-8' });

              const newVersion = {
                resolution: '1080p',
                nzbFile: nzbContent,
                hash: fileHash
              };

              if (selectedMovie.manualEntry) {
                await collection.insertOne({
                  title: selectedMovie.title,
                  year: selectedMovie.year,
                  versions: [newVersion]
                });
              } else {
                const existingDocument = await collection.findOne({ tmdbId: selectedMovie.id });
                if (existingDocument) {
                  await collection.updateOne(
                    { tmdbId: selectedMovie.id },
                    { $push: { versions: newVersion } }
                  );
                } else {
                  selectedMovie.tmdbId = selectedMovie.id;
                  delete selectedMovie.id;
                  selectedMovie.versions = [newVersion];
                  await collection.insertOne(selectedMovie);
                }
              }

              const newFilePath: string = path.join(archiveDirPath, file);
              fs.renameSync(nzbFilePath, newFilePath);
            } else {
              console.log(`Eine Version mit demselben Hash (${fileHash}) existiert bereits in der Datenbank.`);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
    rl.close();
  }
};

insertNZBIntoMongo();



