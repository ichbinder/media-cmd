import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { IRequestWithUser } from '../middleware/auth.middleware';
import * as dotenv from 'dotenv';

dotenv.config();

const secretKey: string | undefined = process.env.JWT_SECRET;

if (!secretKey) {
    throw new Error('Please define the environment variable JWT_SECRET.');
}

const expiresIn = '2h';
const dateInPast = () => new Date(Date.now() + 2 * 3600 * 1000); // +2 Stunden

export const createUser = async (req: IRequestWithUser, res: Response) => {
    try {
        // Destructure the body data
        const { newUsername, newPassword, newRole } = req.body;

        if (!newUsername || !newPassword) {
            throw new Error('Username and password required');
        }
        
        // Optional: Hier könnten Sie zusätzliche Validierungen hinzufügen

        const saltRounds = 8;

        // Passwort verschlüsseln
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Neuen Benutzer erstellen
        const newUser = new User({ 
            username: newUsername, 
            password: hashedPassword, 
            role: newRole 
        });

        // Speichern Sie den neuen Benutzer in der Datenbank
        await newUser.save();

        // Ein JWT Token für den neuen Benutzer erstellen
        const token = jwt.sign({ id: newUser._id }, secretKey, { expiresIn });

        console.log('expiresIn: ', expiresIn);
        

        // Token dem neuen Benutzer hinzufügen
        newUser.tokens = newUser.tokens.concat({ token, expiresIn: dateInPast() });
        
        await newUser.save();

        // Rückgabe der Benutzerdaten und des Tokens
        res.status(201).json({ 
            username: newUser.username, 
            role: newUser.role, 
            token
        });
    } catch (error: any) {
        if (error.code === 11000) {
            // Dies ist der Fehlerkode für einen Duplikatschlüssel
            return res.status(409).json({ message: 'User exists. Please choose a different username.' });
        } else if (error instanceof Error) {
            res.status(400).json({ message: 'Unable to create user', error: error.message });
        } else {
            // Fallback für den Fall, dass es sich um einen unerwarteten Fehlertyp handelt
            res.status(400).json({ message: 'Unable to create user', error: 'An unknown error occurred' });
        }
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new Error('Username and password required');
        }

        const user = new User({ username, password });
        await user.save();
    
        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn });
        user.tokens = user.tokens.concat({ token, expiresIn: dateInPast() });
    
        await user.save();

        console.log(token);
        
        
        res.send({ 
            username: user.username, 
            role: user.role, 
            token
        });
    } catch (error: any) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Unable to register', error: error.message });
        } else {
            // Fallback für den Fall, dass es sich um einen unerwarteten Fehlertyp handelt
            res.status(400).json({ message: 'Unable to register', error: 'An unknown error occurred' });
        }
    }
};
  
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            throw new Error('False username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('False username or password not match');
        }

        user.tokens = user.tokens.filter(token => token.expiresIn > new Date());
        await user.save();

        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn });
        user.tokens = user.tokens.concat({ token, expiresIn: dateInPast() });

        await user.save();

        res.send({ 
            username: user.username, 
            role: user.role, 
            token 
        });
    } catch (error: any) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Unable to login', error: error.message });
        } else {
            // Fallback für den Fall, dass es sich um einen unerwarteten Fehlertyp handelt
            res.status(400).json({ message: 'Unable to login', error: 'An unknown error occurred' });
        }
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        // Zugang zum Benutzerobjekt und zum Token aus der auth-Middleware
        const { user, token } = req as IRequestWithUser; 

        if (!token) {
            return res.status(401).json({ message: 'No active session to terminate.' });
        }
    
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
    
        // Entfernen des Tokens aus der Liste der aktiven Tokens
        user.tokens = user.tokens.filter((t: { token: string }) => t.token !== token);
    
        // Speichern Sie die Änderungen
        await user.save();
    
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        // Besserer, generischer Ansatz für Fehlerbehandlung
        const errorMessage = error instanceof Error ? error.message : 'Failed to logout.';
        res.status(500).json({ message: 'Unable to logout', error: errorMessage });
    }
};