import { body, check, param, validationResult, query } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const expectedFieldsSearchMovie = [
    'query', 
    'include_adult', 
    'language', 
    'primary_release_year', 
    'page', 
    'region', 
    'year'
];

const validateSearchMoviesQuery = [
    body(expectedFieldsSearchMovie[0]).isString().isLength({ min: 3, max: 100 }),
    body(expectedFieldsSearchMovie[1]).optional().isBoolean(),
    body(expectedFieldsSearchMovie[2]).optional().isString(),
    body(expectedFieldsSearchMovie[3]).optional().isString(),
    body(expectedFieldsSearchMovie[4]).optional().isInt(),
    body(expectedFieldsSearchMovie[5]).optional().isString(),
    body(expectedFieldsSearchMovie[6]).optional().isString(),
    check().custom((value, { req }) => {
        const unexpectedFields = Object.keys(req.body).filter(field => !expectedFieldsSearchMovie.includes(field));
        if (unexpectedFields.length > 0) {
            throw new Error(`Unexpected field(s): ${unexpectedFields.join(', ')}`);
        }
        console.log('custom validation: ', value, req.body);
        
        return true;
    }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const expectedFieldsMovieDetails = [
    'append_to_response', 
    'language',
    'movie_id'
];

const validateMovieDetails = [
    query(expectedFieldsMovieDetails[0]).optional().isString(),
    query(expectedFieldsMovieDetails[1]).optional().isString(),
    param(expectedFieldsMovieDetails[2]).isString(),
    (req: Request, res: Response, next: NextFunction) => {
        const unexpectedQueryFields = Object.keys(req.query).filter(field => !expectedFieldsMovieDetails.includes(field));
        if (unexpectedQueryFields.length > 0) {
            return res.status(400).json({ errors: `Unexpected query field(s): ${unexpectedQueryFields.join(', ')}` });
        }
        next();
    },
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export {
    validateSearchMoviesQuery,
    validateMovieDetails,
};