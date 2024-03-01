import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Box, styled } from '@mui/material';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import { getPosterRatingSize, imgTmdbUrl } from '../../types/types';
import PosterRating, { PosterRatingSizeTypes } from './PosterRating';

export const PosterSize = {
    LG: 156,
    MD: 90,
    SM: 60
} as const;

export type PosterSizeType = typeof PosterSize[keyof typeof PosterSize];

const BORDER_SIZE = 2;


const calcHeightAspectRatio = (width: number) => {
    return width * 1.5125;
};

const PosterWrapper = styled('div')(({ theme }) => ({
    position: 'relative',
    border: `solid ${BORDER_SIZE}px #ffffff`,
}));

const PosterImg = styled('img')(({ theme }) => ({
    position: 'absolute',
    
}));

type PosterProps = {
    title?: string;
    posterPath?: string;
    url?: string;
    width?: number;
    height?: number;
    size?: PosterSizeType;
    rating?: number;
};

const Poster: FunctionComponent<PropsWithChildren<PosterProps>> = (props) => {
    const size: PosterSizeType = props.size ? props.size : PosterSize.LG;
    const width = props.width ? props.width : size;
    const height = props.height ? props.height : calcHeightAspectRatio(width);
    const title = props.title ? props.title : "No title";
    const rating = props.rating ? props.rating : 0;
    const showRating = rating > 0;
    const posterRatingSize = getPosterRatingSize[size];

    const posterRatingPositioning = (position: PosterSizeType) => {
        if (position === PosterSize.LG) {
            return {
                left: '95px',
                bottom: '-176px'
            };
        } else if (position === PosterSize.MD) {
            return {
                left: '48px',
                bottom: '-94px'
            };
        } else {
            return {
                left: '34px',
                bottom: '-65px'
            };
        }
    };

    if (props.posterPath === null || props.posterPath === undefined) {
        return (
            <Box sx={{
                width: `${width}px`, 
                height: `${height}px`, 
                backgroundColor: '#c6c6c6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <LocalMoviesIcon />
                {showRating && <PosterRating rating={rating} size={posterRatingSize} />}
            </Box>    
        );
    }

    const imgUrl = props.url ? props.url : `${imgTmdbUrl}/w200`;
    const posterPath = imgUrl + props.posterPath;

    return (
        <PosterWrapper
            sx={{
                width: `${width + BORDER_SIZE * 2}px`, 
                height: `${height + BORDER_SIZE * 2}px`, 
            }}
        >
            <PosterImg
                src={posterPath}
                alt={title}
                width={width}
                height={height}
            />
            {showRating && 
                <Box
                    sx={{
                        position: 'relative',
                        ...posterRatingPositioning(size)
                    }}
                >
                    <PosterRating rating={rating} size={posterRatingSize} />
                </Box>    
            }
        </PosterWrapper>
    );
};

export default Poster;