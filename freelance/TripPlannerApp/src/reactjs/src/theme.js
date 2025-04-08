// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#2E3B55' },
    secondary: { main: '#FF5722' },
  },
  typography: {
    h5: { fontWeight: 'bold' },
  },
});

export default theme;
