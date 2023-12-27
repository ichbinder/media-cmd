import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import * as dotenv from 'dotenv';

dotenv.config();

const secretKey: string | undefined = process.env.JWT_SECRET;

if (!secretKey) {
    throw new Error('Please define the environment variable JWT_SECRET.');
}

export interface IRequestWithUser extends Request {
  user?: IUser;
  token?: string;
};

export const auth = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('No token provided');
        }
        console.log(token);
        
        const decoded = jwt.verify(token, secretKey) as { id: string };

        console.log(decoded);
        
        
        const user = await User.findOne({
            _id: decoded.id,
            'tokens.token': token,
            'tokens.expiresIn': {$gt: new Date()}
        });

        if (!user) {
            throw new Error('Please authenticate.');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error: any) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Unable to auth', error: 'Token expired' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Unable to auth', error: 'Invalid token' });
        } else if (error instanceof Error) {
            res.status(401).json({ message: 'Unable to auth', error: error.message });
        } else {
            // Fallback für den Fall, dass es sich um einen unerwarteten Fehlertyp handelt
            res.status(401).json({ message: 'Unable to auth', error: 'An unknown error occurred' });
        }
    }
};
  
export const isAdmin = (req: IRequestWithUser, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Administrator privileges required.' });
};

export const isTokenValid = (req: IRequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        jwt.verify(token, secretKey);
        next();
    } catch (error) {
        let status = 500;
        let message = 'Internal server error.';

        if (error instanceof jwt.TokenExpiredError) {
            status = 401;
            message = 'Token expired.';
        } else if (error instanceof jwt.JsonWebTokenError) {
            status = 401;
            message = 'Invalid token.';
        }

        return res.status(status).json({ message, valid: false });
    }
};
