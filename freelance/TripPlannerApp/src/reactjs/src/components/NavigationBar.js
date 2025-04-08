// src/components/NavigationBar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NavigationBar() {
  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Trip Planner App
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/trip">
            Trip Planner
          </Button>
          {/* Vous pouvez ajouter d’autres liens ici si nécessaire */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
