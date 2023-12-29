import createClient, { ClientOptions } from "openapi-fetch";
import { paths, components } from '../types/tmbd';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey: string | undefined = process.env.TMDB_API_KEY;

if (!apiKey) {
    throw new Error('Please define the environment variable TMDB_API_KEY.');
}

const baseUrl = 'https://api.themoviedb.org';
const clientOptions: ClientOptions = {
    baseUrl,
    headers: {
        'Authorization': `Bearer ${apiKey}`,
    },
};

const tmdbFetch = () => createClient<paths>(clientOptions);

type SearchMoviesQuery = paths['/3/search/movie']['get']['parameters']['query'];
const tmdbSearchMovies = async (query: SearchMoviesQuery) => {
    const { data, error } = await tmdbFetch().GET('/3/search/movie', {
        params: {
            query,
        },
    });

    if (error) {
        throw new Error(error);
    }

    return data;
}

type MovieDetailsQuery = paths['/3/movie/{movie_id}']['get']['parameters']['query'];
const tmdbMovieDetails = async (query: MovieDetailsQuery, movie_id: number) => {
    const { data, error } = await tmdbFetch().GET('/3/movie/{movie_id}', {
        params: {
            query: {
                ...query,
            },
            path: {
                movie_id,
            },
        },
    });

    if (error) {
        throw new Error(JSON.stringify(error));
    }

    return data;
}

export {
    tmdbFetch,
    SearchMoviesQuery,
    tmdbSearchMovies,
    MovieDetailsQuery,
    tmdbMovieDetails,
}

