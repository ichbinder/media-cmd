import { Request, Response } from 'express';
import { tmdbSearchMovies, SearchMoviesQuery, tmdbMovieDetails, MovieDetailsQuery } from '../services/tmdb.fetch';
import { ParsedQs } from 'qs'; // Stellen Sie sicher, dass ParsedQs importiert wird


interface ISearchMoviesRequest extends Request {
    body: SearchMoviesQuery;
}

const searchMovies = async (req: ISearchMoviesRequest, res: Response) => {
    try {
        const response = await tmdbSearchMovies({ ...req.body });
        
        res.send(response);
    } catch (error: any) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Unable to search movies', error: error.message });
        } else {
            res.status(400).json({ message: 'Unable to search movies', error: 'An unknown error occurred' });
        }
    }
};


interface IMovieDetailsRequest extends Request {
    query: MovieDetailsQuery & ParsedQs;
    params: {
        movie_id: string;
    }
};

const getMovieDetails = async (req: IMovieDetailsRequest, res: Response) => {
    try {        
        const response = await tmdbMovieDetails({ ...req.query }, parseInt(req.params.movie_id));
        
        res.send(response);
    } catch (error: any) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Unable to search movies', error: error.message });
        } else {
            res.status(400).json({ message: 'Unable to search movies', error: 'An unknown error occurred' });
        }
    }
};

export {
    searchMovies,
    getMovieDetails,
};