import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { getSearchedMovies } from '../controllers/usenet.controller';

const router = Router();

// Route zum Durchsuchen der usenetCollection nach dem Namen.
router.get('/movies', auth, getSearchedMovies);

export default router;


