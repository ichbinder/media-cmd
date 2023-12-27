import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { paths } from '../types/tmbd';
import { searchMovieOnTmdb, getMovieDetailsFromTmdb } from '../services/backendApiRequests';

type SearchMovieResponse = paths['/3/search/movie']['get']['responses']['200']['content']['application/json'];
type SearchMoviesResults = paths['/3/search/movie']['get']['responses']['200']['content']['application/json']['results'];
type SearchMovie = NonNullable<SearchMoviesResults>[number];
type SearchMovieQuery = paths['/3/search/movie']['get']['parameters']['query'];
type MovieDetailsResponse = paths['/3/movie/{movie_id}']['get']['responses']['200']['content']['application/json'];
type MovieDetails = NonNullable<MovieDetailsResponse>;

type TmdbStoreProps = {
    searchedMovie: SearchMovieResponse | {};
    movieDetails: MovieDetails | {};
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setSearchMovie: (response: SearchMovieResponse) => void;
    searchMovie: (query: SearchMovieQuery) => Promise<void>;
    getMovieDetails: (movieId: number) => Promise<void>;
};

const useTmdbStore = create<TmdbStoreProps>()(
    persist((set) => ({
        searchedMovie: {},
        movieDetails: {},
        loading: false,
        setLoading: (loading: boolean) => set(() => ({ loading })),
        setSearchMovie: (response) => set(() => ({ searchedMovie: response })),
        searchMovie: (query: SearchMovieQuery) => searchMovie(set, query),
        getMovieDetails: (movieId: number) => getMovieDetails(set, movieId),
    }), { name: 'tmdb-storage'})
);

const searchMovie = async (set: any, query: SearchMovieQuery) => {
    try {
        set(() => ({ loading: true }));
        const responseData: SearchMovieResponse = await searchMovieOnTmdb(query);
        if (responseData.results && responseData.results.length === 0) {
            responseData.results = [];
        }
        set(() => ({ loading: false }));
        set(() => ({ searchedMovie: responseData }));
    } catch (error) {
        console.error('Search movie error: ', error);
    }
};

const getMovieDetails = async (set: any, movieId: number) => {
    try {
        set(() => ({ loading: true }));
        const responseData: MovieDetails = await getMovieDetailsFromTmdb(movieId);
        set(() => ({ loading: false }));
        set(() => ({ movieDetails: responseData }));
    } catch (error) {
        console.error('Get movie details error: ', error);
    }
};

export {
    SearchMovieResponse,
    SearchMovieQuery,
    SearchMoviesResults,
    SearchMovie,
    MovieDetailsResponse,
    MovieDetails,
    useTmdbStore
};
