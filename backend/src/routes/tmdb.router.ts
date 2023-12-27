import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { searchMovies, getMovieDetails } from '../controllers/tmdb.controller';
import { validateSearchMoviesQuery, validateMovieDetails } from '../middleware/tmdb.middleware';

const router = Router();

router.post('/search/movie', auth, validateSearchMoviesQuery, searchMovies);
router.get('/movie/:movie_id', auth, validateMovieDetails, getMovieDetails);

export default router;