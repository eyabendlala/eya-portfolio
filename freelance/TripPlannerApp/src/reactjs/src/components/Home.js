// src/components/Home.js
import React from 'react';
import { Container, Typography, Box, Paper, Button, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
  {/* Hero Section */}
  <Box
        sx={{
          position: 'relative',
          height: 400,
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4,
          boxShadow: 3,
        }}
      >
        {/* Background image */}
        <Box
          component="img"
          src="/images/truck3.jpeg"
          alt="Hero Background"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(46,59,85,0.8), rgba(255,87,34,0.8))',
          }}
        />
        {/* Text content */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            transform: 'translateY(-50%)',
            color: '#fff',
            zIndex: 1,
          }}
        >
          <Typography variant="h3" gutterBottom>
            Welcome to Trip Planner
          </Typography>
          <Typography variant="h6" gutterBottom>
            Plan your trips, visualize your routes, and check your ELD Logs with ease.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={RouterLink}
            to="/trip"
            sx={{ mt: 2 }}
          >
            Start planning your trip
          </Button>
        </Box>
      </Box>

      {/* Feature Cards Section */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box
                component="img"
                src="/images/map.jpeg"
                alt="Interactive Map"
                sx={{ width: '100%', height: 200, objectFit: 'cover', mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Interactive Maps
              </Typography>
              <Typography variant="body1">
                Visualize your route with detailed maps highlighting your current, pickup, and dropoff locations.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box
                component="img"
                src="/images/dashboard.jpeg"
                alt="Dashboard"
                sx={{ width: '100%', height: 200, objectFit: 'cover', mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Comprehensive Dashboard
              </Typography>
              <Typography variant="body1">
                Manage all your trip details with an intuitive dashboard that keeps track of your journey.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Box
                component="img"
                src="/images/Analytics.jpg"
                alt="Real-Time Analytics"
                sx={{ width: '100%', height: 200, objectFit: 'cover', mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                Real-Time Analytics
              </Typography>
              <Typography variant="body1">
                Track driving hours, rest times, and fuel stops in real-time to optimize your performance.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
