import React, { FunctionComponent, PropsWithChildren } from 'react';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography } from '@mui/material';
import theme from '../../styles/Theme';


export const PosterRatingSize = {
    LG: 70,
    MD: 50,
    SM: 30,
} as const;

export type PosterRatingSizeTypes = (typeof PosterRatingSize)[keyof typeof PosterRatingSize];

export const PosterRatingColor = {
    BAD: 'error',
    OK: 'warning',
    SUPER: 'success',
    NEUTRAL: 'info',
    DEFAULT: 'secondary',
} as const;

export type PosterRatingColorTypes = (typeof PosterRatingColor)[keyof typeof PosterRatingColor];

const CircularPosterRating = styled('div')(({ theme }) => ({
    backgroundColor: '#efefef',
    border: 'solid 2px #ffffff',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}));

type PosterRatingProps = {
    rating: number,
    size?: PosterRatingSizeTypes,
    color?: PosterRatingColorTypes,
}

const PosterRating: FunctionComponent<PropsWithChildren<PosterRatingProps>> = (props) => {
    const size = props.size || PosterRatingSize.LG;
    const color = props.color || PosterRatingColor.DEFAULT;
    const percentage = Math.round((props.rating / 10) * 100);
    return (
        <CircularPosterRating
            sx={{
                width: `${size + 4}px`,
                height: `${size + 4}px`,
            }}
        >
            <CircularProgress
                color={color}
                variant='determinate'
                size={size}
                value={percentage}
            />
            <Box
                sx={{
                    width: `${size - 11}px`,
                    height: `${size - 11}px`,
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    sx={{
                        margin: '0 0 0 3px'
                    }}
                    variant='h5'
                    component='div'
                    color={theme.palette.secondary.main}
                >
                    {`${percentage}%`}
                </Typography>
            </Box>
        </CircularPosterRating>  
    );
};

export default PosterRating;
