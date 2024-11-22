// styles.js
import { createTheme } from '@mui/material/styles';

const getTheme = darkMode =>
  createTheme({
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0'
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0'
      },
      body1: {
        fontWeight: 'normal'
      }
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000'
      },
      secondary: {
        main: '#208080'
      }
    }
  });

export default getTheme;
