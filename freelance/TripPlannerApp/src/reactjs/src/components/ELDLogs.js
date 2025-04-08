import { Paper, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';

export default function ELDLogs({ logs }) {
  return (
    <Paper sx={{ p: 3 }} elevation={3}>
      <Typography variant="h5" gutterBottom>ELD Logs</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
      Total Driving Hours:{' '} <Chip label={`${logs.total_driving_hours.toFixed(1)}h`} color="primary" />
      </Typography>
      
      <List>
        {logs.logs.map((log, index) => (
          <ListItem key={index}>
            {log.type === 'Fuel Stop' ? (
              <ListItemText
                primary={log.type}
                secondary={`Stops: ${log.count}`}
              />
            ) : (
              <ListItemText
                primary={log.type}
                secondary={`Duration: ${log.duration.toFixed(1)}h`}
              />
            )}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}