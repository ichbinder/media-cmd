import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import usenetRouter from './routes/usenet.router'; // Importiere den default exportierten Router
import authRouter from './routes/auth.router';
import tmdbRouter from './routes/tmdb.router';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT: string | undefined = process.env.EXPRESS_PORT;

if (!PORT) {
    throw new Error('Please define the environment variable EXPRESS_PORT.');
}

const app: Express = express();

app.use(cors());
app.use(express.json());

const uri: string = 'mongodb://root:example@localhost'; // Ersetze dies mit deinem Verbindungs-String
mongoose.connect(uri, { dbName: 'media_cms' })
  .then(() => {
      console.log('MongoDB connection established successfully');
  })
  .catch((error: Error) => {
      console.log('MongoDB connection error: ', error.message);
  });

app.use('/auth', authRouter);

app.use("/search", usenetRouter);

app.use('/tmdb', tmdbRouter);

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
