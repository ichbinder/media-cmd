import { createUser, login, logout } from '../controllers/auth.controller';
import { Router } from 'express';
import { auth, isAdmin, isTokenValid } from '../middleware/auth.middleware';

const router = Router();

router.post('/user/login', login);

router.post('/user/logout', auth, logout);

router.post('/user/create', auth, isAdmin, createUser);

router.get('/user/tokenIsValid', isTokenValid, (req, res) => {
    res.status(200).json({ valid: true });
});
export default router;