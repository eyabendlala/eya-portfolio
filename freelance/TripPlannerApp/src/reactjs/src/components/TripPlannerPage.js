// src/components/TripPlannerPage.js
import React, { useState } from 'react';
import { Container, CssBaseline, Box } from '@mui/material';
import TripForm from './TripForm';
import MapDisplay from './MapDisplay';
import ELDLogs from './ELDLogs';

export default function TripPlannerPage() {
  const [tripData, setTripData] = useState(null);

  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Box sx={{ mt: 4, mb: 4 }}>
        <TripForm onSuccess={setTripData} />
        {tripData && (
          <>
            <MapDisplay trip={tripData} />
            <ELDLogs logs={tripData.eld_logs} />
          </>
        )}
      </Box>
    </Container>
  );
}
