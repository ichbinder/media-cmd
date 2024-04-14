import React, { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import { MovieDetails, useTmdbStore } from '../store/useTmdbStore';
import { Box, Container, Typography } from '@mui/material';
import { imgTmdbUrl } from '../types/types';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Poster, { PosterSize } from '../components/Poster/Poster';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const BackdropWrapper = styled('div', {
    label: 'backdropWrapper'
})(({ theme }) => ({
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
}));

const BackdropImg = styled('img', {
    label: 'backdropImg'
})(({ theme }) => ({
    objectFit: 'cover',
    objectPosition: 'center',
    position: 'relative',
    maxHeight: '40vh',
    width: '100%',
    minHeight: '260px',
    maxWidth: '100%',
}));

const PosterWrapper = styled('div', {
    label: 'posterWrapper'
})(({ theme }) => ({
    position: 'relative',
    bottom: '-70px',
    height: 'fit-content',
}));

const PosterTitle = styled('span', {
    label: 'posterTitle'
})(({ theme }) => ({
    marginLeft: '20px',
    textShadow: 'rgba(0, 0, 0, 0.7) 0px 2px 14px',
    color: 'white',
    marginBottom: '19px',
    fontSize: '40px',
    fontWeight: '600px',
    letterSpacing: '1.57px',
}));

const MovieTopInfo = styled('div', {
    label: 'movieTopInfo'
})(({ theme }) => ({
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
    const theme = useTheme();
    const matchesMediaQuerySM = useMediaQuery(theme.breakpoints.down('sm'));
    const matchesMediaQueryMd = useMediaQuery(theme.breakpoints.down('md'));

    const matchesMediaQuery = () => {
        if (matchesMediaQueryMd && !matchesMediaQuerySM) {
            return PosterSize.MD;
        } else if (matchesMediaQuerySM && matchesMediaQueryMd) {
            return PosterSize.SM;
        } else {
            return PosterSize.LG;
        }
    }    
    
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
                        <Poster 
                            posterPath={movieDetails.poster_path} 
                            size={matchesMediaQuery()} 
                            rating={movieDetails.vote_average}
                        />
                    </PosterWrapper>
                    <PosterTitle>   
                        {movieDetails.title}
                    </PosterTitle>
                </MovieTopInfo>
            </BackdropWrapper>
            <Container maxWidth="lg">
                <Box>

                </Box>
                {movieDetails.overview}
            </Container>
        </>
    );
};

export default Movie;
