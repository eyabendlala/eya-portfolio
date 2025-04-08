import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#2E3B55' },
    secondary: { main: '#FF5722' }
  }
});

<Grid container spacing={3}>
  <Grid item xs={12} md={6}>...</Grid>
  <Grid item xs={12} md={6}>...</Grid>
</Grid>