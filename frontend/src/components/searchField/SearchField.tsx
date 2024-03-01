import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from "react";
import { SearchMovie, SearchMovieQuery, SearchMovieResponse, useTmdbStore } from "../../store/useTmdbStore";
import { Autocomplete, Box, CircularProgress, InputBase } from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import RenderOption from "./RenderOption";
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: '70%',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const SearchField: FunctionComponent<PropsWithChildren> = (props) => {
    const [open, setOpen] = React.useState(false);
    const [searchText, setSearchText] = useState("");
    const searchMovie = useTmdbStore((state) => state.searchMovie);
    const searchResults: SearchMovieResponse = useTmdbStore((state) => state.searchedMovie);
    const loading = useTmdbStore((state) => state.loading);
    const navigate = useNavigate();

    // Suchen Sie nach Filmen, wenn sich der Suchtext ändert
    useEffect(() => {
        if (searchText.length >= 3) {
            const query: SearchMovieQuery = {
                query: searchText,
                language: "de-DE",
                page: 1,
                include_adult: false,
            };
            searchMovie(query);
        }

    }, [searchText]);

    // Add null check for searchResults
    const options = searchResults.results ? searchResults.results : [];

    const getOptionLabel = (option: SearchMovie | String): string => {        
        if (typeof option === "string") {
            return option;
        }

        const movie = option as SearchMovie;

        const releaseDate = movie.release_date ? movie.release_date : new Date();
        const datum = new Date(releaseDate);
        const year = datum.getFullYear();
        return `${movie.title} ${year}`;
    };    

    const isMovie = (option: any): option is SearchMovie => {
        return (option as SearchMovie) && ((option as SearchMovie).title !== undefined);
    }
   
    return (
        <Autocomplete
            id="SearchField"
            sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            freeSolo
            open={open}
            options={options}
            loading={loading}
            inputValue={searchText}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            onChange={(event, newValue) => {
                isMovie(newValue) && navigate('/movie', { state: { movieId: newValue.id }});                    
            }}
            onInputChange={(event, newInputValue) => {
                setSearchText(newInputValue);
            }}
            renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: SearchMovie) => (
                <Box component="li" {...props} key={props.id}>
                    <RenderOption {...option} other={props} />      
                </Box>         
            )}
            renderInput={(params) => {
                const { InputLabelProps, InputProps, ...rest } = params;
                return (
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            {...params.InputProps} 
                            {...rest}
                            ref={params.InputProps.ref}
                            placeholder="Search..."
                        />
                    </Search>
                );

            }}
        />
    );

};

export default SearchField;