// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import TripPlannerPage from './components/TripPlannerPage';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trip" element={<TripPlannerPage />} />
          {/* D'autres routes pourront être ajoutées ici si besoin */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
