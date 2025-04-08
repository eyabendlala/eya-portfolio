import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Paper, CircularProgress } from '@mui/material';

// Fix for Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapDisplay({ trip }) {
  if (!trip?.coords || !trip.coords.current || !trip.coords.pickup || !trip.coords.dropoff) {
    return (
      <Paper sx={{ p: 2, mb: 4, textAlign: 'center' }} elevation={3}>
        <CircularProgress /> <p>Loading map...</p>
      </Paper>
    );
  }

  const { current, pickup, dropoff } = trip.coords;

  return (
    <Paper sx={{ p: 2, mb: 4 }} elevation={3}>
      <MapContainer center={current} zoom={5} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={current}>
          <Popup>Current Location</Popup>
        </Marker>
        <Marker position={pickup}>
          <Popup>Pickup Location</Popup>
        </Marker>
        <Marker position={dropoff}>
          <Popup>Dropoff Location</Popup>
        </Marker>
        <Polyline positions={[current, pickup, dropoff]} color="blue" />
      </MapContainer>
    </Paper>
  );
}
