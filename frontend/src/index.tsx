import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/Theme';
import { ThemeProvider } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const rootElement = document.getElementById('root');

// Überprüfe, ob rootElement nicht null ist, bevor du createRoot aufrufst
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline /> {/* Material UI CssBaseline für einen kohärenten Stil */}
                <App />
            </ThemeProvider>
        </React.StrictMode>
    );
} else {
    console.error('Failed to find the root element');
}