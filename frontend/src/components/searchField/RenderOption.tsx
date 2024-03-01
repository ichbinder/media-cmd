import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Box, Typography } from '@mui/material';
import Poster, { PosterSize } from '../Poster/Poster';

type RenderOptionProps = {
    id?: number;
    title?: string;
    poster_path?: string;
    release_date?: string;
    original_title?: string;
    other: React.HTMLAttributes<HTMLLIElement>;
};

const RenderOption: FunctionComponent<PropsWithChildren<RenderOptionProps>> = (props) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                margin: '10px',
            }}
        >
            <Poster title={props.title} posterPath={props.poster_path} size={PosterSize.SM} />
            <Box
                sx={{ marginLeft: '10px' }}>   
                <Typography fontSize={'12px'} color={'#f4645a'} fontWeight={'bold'}>
                    Film
                </Typography>
                {props.title && <Typography fontSize={'15px'} fontWeight={500}>
                    {`${props.title} - ${props.release_date?.slice(0, 4)}`}
                </Typography>}
                <div>
                    {props.original_title && <Typography fontSize={'12px'}>
                        <b>Original Title:</b>{` ${props.original_title}`}
                    </Typography>}
                </div>
            </Box>
        </Box>
    );
};

export default RenderOption;
