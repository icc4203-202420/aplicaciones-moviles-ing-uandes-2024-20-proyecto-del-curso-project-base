import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';

const BarDetails = ({ bar, onClose }) => {
  // Verificar que `bar` está definido
  if (!bar) {
    return null; // O mostrar un mensaje de error o un estado vacío
  }

  // Verifica que las propiedades están definidas
  const { name, address, events, beers } = bar;

  return (
    <Box
      sx={{
        position: 'absolute',
        color: 'black',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '600px',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '8px',
        overflowY: 'auto' // Agregar scroll si el contenido es largo
      }}
    >
      <Typography variant="h6" component="h2">
        {name || 'No Name'}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {address?.line1 || 'No Address'}
      </Typography>
      
      <Typography variant="h6" component="h3" sx={{ mt: 3 }}>
        Events
      </Typography>
      <List>
        {events && events.length > 0 ? (
          events.map((event, index) => (
            <ListItem key={index}>
              <ListItemText primary={event.name} secondary={event.date} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">No Events</Typography>
        )}
      </List>

      <Typography variant="h6" component="h3" sx={{ mt: 3 }}>
        Beers
      </Typography>
      <List>
        {beers && beers.length > 0 ? (
          beers.map((beer, index) => (
            <ListItem key={index}>
              <ListItemText primary={beer.name} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">No Beers</Typography>
        )}
      </List>

      <Button variant="outlined" sx={{ mt: 2 }} onClick={onClose}>
        Close
      </Button>
    </Box>
  );
};

export default BarDetails;
