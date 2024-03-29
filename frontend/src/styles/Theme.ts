import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main:'#2d2338',
        },
        secondary: {
            main: '#f4645a',
        },
        text: {
            primary: '#2d2338',
            secondary: '#f4645a',
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default theme;