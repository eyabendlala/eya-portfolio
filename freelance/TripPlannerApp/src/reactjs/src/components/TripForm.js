import { useState } from 'react';
import { Button, TextField, Paper, Typography, Grid, CircularProgress } from '@mui/material'; // Ajout de Grid et CircularProgress
import axios from 'axios';

export default function TripForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used: '',
    distance: ''
  });

  const [loading, setLoading] = useState(false); // Ajout de l'état loading

  async function geocodeAddress(address) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      {
        headers: {
          'User-Agent': 'VotreNomDeProjet/1.0' // Important : indiquez un User-Agent valide
        }
      }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    return null;
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      // Géocodez chaque adresse
    const currentCoords = await geocodeAddress(formData.current_location);
    const pickupCoords = await geocodeAddress(formData.pickup_location);
    const dropoffCoords = await geocodeAddress(formData.dropoff_location);

    const updatedTripData = {
      ...formData,
      coords: {
        current: [currentCoords.lat, currentCoords.lon],
        pickup: [pickupCoords.lat, pickupCoords.lon],
        dropoff: [dropoffCoords.lat, dropoffCoords.lon]
      }
    };
      const response = await axios.post('http://localhost:8000/api/trips/', updatedTripData);
      onSuccess(response.data);
      // Réinitialiser le formulaire après succès
      setFormData({
        current_location: '',
        pickup_location: '',
        dropoff_location: '',
        current_cycle_used: '',
        distance: ''
      });
    } catch (error) {
      console.error('Error:', error);
    }
    finally {
      setLoading(false); // On désactive le chargement après l'exécution
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#2E3B55', fontWeight: 'bold' }}>
        Trip Planner
      </Typography>
      
<form onSubmit={handleSubmit}>
  <Grid container spacing={2}>
    {/* Current Location */}
    <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        label="Current Location"
        name="current_location"
        value={formData.current_location}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        required
      />
    </Grid>

    {/* Pickup Location */}
    <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        label="Pickup Location"
        name="pickup_location"
        value={formData.pickup_location}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        required
      />
    </Grid>

    {/* Dropoff Location */}
    <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        label="Dropoff Location"
        name="dropoff_location"
        value={formData.dropoff_location}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        required
      />
    </Grid>

    {/* Current Cycle Used */}
    <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        label="Current Cycle Used (Hours)"
        name="current_cycle_used"
        type="number"
        value={formData.current_cycle_used}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        required
        inputProps={{ min: 0, step: 0.1 }}
      />
    </Grid>

    {/* Distance */}
    <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        label="Distance (Miles)"
        name="distance"
        type="number"
        value={formData.distance}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        required
        inputProps={{ min: 0, step: 1 }}
        // Ajouter à chaque TextField
        error={formData.distance <= 0 && formData.distance !== ''}
        helperText={formData.distance <= 0 ? "Distance must be positive" : ""}
      />
    </Grid>

    {/* Bouton de soumission */}
    <Grid item xs={12}>
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        disabled={loading}
        sx={{ mt: 2, width: '200px' }}
      >
        {loading ? <CircularProgress size={24} /> : 'Calculate Route'}
      </Button>
    </Grid>
  </Grid>
</form>    </Paper>
  );
};



