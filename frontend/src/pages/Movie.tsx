import React, { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { MovieDetails, useTmdbStore } from '../store/useTmdbStore';
import { Box, Typography } from '@mui/material';
import { imgTmdbUrl } from '../types/types';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Poster, { PosterSize } from '../components/Poster/Poster';


const BackdropWrapper = styled('div')(({ theme }) => ({
    width: '100%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
}));

const BackdropImg = styled('img')(({ theme }) => ({
    objectFit: 'cover',
    objectPosition: 'center',
    position: 'relative',
    maxHeight: '40vh',
    width: '100%',
    minHeight: '260px',
    maxWidth: '100%',
}));

const PosterWrapper = styled('div')(({ theme }) => ({
    position: 'relative',
    bottom: '-70px',
    height: 'fit-content',
}));

const MovieTopInfo = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: '0',
    maxWidth: '1024px',
    width: '100%',
    height: '100%',
    zIndex: '10',
    padding: '20px 20px 0 20px',
    display: 'flex',
    alignItems: 'flex-end'
}));

interface MovieProps {
    movieId?: number;
}

const Movie: FunctionComponent<PropsWithChildren<MovieProps>> = (props) => {
    const getMovieDetails = useTmdbStore((state) => state.getMovieDetails);
    const movieDetails: MovieDetails = useTmdbStore((state) => state.movieDetails);
    const location = useLocation();
    
    const movieId = props.movieId || location.state.movieId;

    useEffect(() => {
        if (movieId) {
            getMovieDetails(movieId);
        }
    }, [movieId]);

    return (
        <>
            <BackdropWrapper>
                <BackdropImg src={`${imgTmdbUrl}/w1920_and_h800_multi_faces${movieDetails.backdrop_path}`} />
                <MovieTopInfo >
                    <PosterWrapper>
                        <Poster posterPath={movieDetails.poster_path} size={PosterSize.lg} rating={movieDetails.vote_average} />
                    </PosterWrapper>
                    <Typography
                        variant="h4"
                        color="textPrimary"
                        component="h1"
                        style={{ marginLeft: '20px' }}
                    >   
                        {movieDetails.title}
                    </Typography>
                </MovieTopInfo>
            </BackdropWrapper>
        </>
    );
};

export default Movie;
