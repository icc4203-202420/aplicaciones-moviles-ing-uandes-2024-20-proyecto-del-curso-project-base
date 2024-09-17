import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import axios from 'axios';

const BarDetails = ({ barId, onClose }) => {
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);  // Estado para almacenar los eventos del bar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para obtener los datos del bar cuando `barId` cambia
  useEffect(() => {
    if (!barId) return;
    const fetchBarDetails = async () => {
      try {
        setLoading(true);

        // Obtener detalles del bar
        const barResponse = await axios.get(`/api/v1/bars/${barId}`);
        setBar(barResponse.data);

        // Obtener eventos del bar
        const eventsResponse = await axios.get(`/api/v1/bars/${barId}/events`);
        console.log("events data",eventsResponse.data);
        setEvents(eventsResponse.data.events); // Suponiendo que los eventos están en `data.events`

        setLoading(false);
      } catch (err) {
        setError('Error fetching bar details');
        setLoading(false);
      }
    };

    fetchBarDetails();
  }, [barId]);

  // Mostrar un spinner mientras se cargan los datos
  if (loading) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar un mensaje de error si la petición falla
  if (error) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Typography variant="body1" color="error">
          {error}
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={onClose}>
          Close
        </Button>
      </Box>
    );
  }

  // Verificar que `bar` está definido
  if (!bar) {
    return <Typography>No data available</Typography>; // Mensaje en caso de que `bar` sea null o undefined
  }

  // Verifica que las propiedades están definidas
  const {
    name = 'No Name',
    address = {},
    beers = []
  } = bar;
  
  const { line1 = 'No Address', line2, city } = address;
  
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
      {/* Nombre del Bar */}
      <Typography variant="h6" component="h2">
        {name}
      </Typography>
      
      {/* Dirección */}
      <Typography variant="body1" sx={{ mt: 2 }}>
        {line1}
      </Typography>

      <Typography variant="h6" component="h3" sx={{ mt: 3 }}>
        Events
      </Typography>
      <List>
        {events.length > 0 ? (
          events.map((event) => (
            <ListItem button key={event.id}>
              <ListItemText
                primary={
                  <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                    {event.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                      Start Date: {event.start_date ? new Date(event.start_date).toLocaleDateString() : 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                      End Date: {event.end_date ? new Date(event.end_date).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </>
                }
              />
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
        {beers.length > 0 ? (
          beers.map((beer, index) => (
            <ListItem key={index}>
              <ListItemText primary={beer.name || 'No Name'} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">No Beers</Typography>
        )}
      </List>

      {/* Botón para cerrar */}
      <Button variant="outlined" sx={{ mt: 2 }} onClick={onClose}>
        Close
      </Button>
    </Box>
  );
};

export default BarDetails;
