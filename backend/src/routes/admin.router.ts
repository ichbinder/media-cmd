// auth.controller importieren
import { createUser } from '../controllers/auth.controller';
import { Router } from 'express';
import { auth, isAdmin } from '../middleware/auth.middleware';

// Router-Instanz erstellen
const router = Router();

// Admin Route zum Erstellen neuer Benutzer

export default router;