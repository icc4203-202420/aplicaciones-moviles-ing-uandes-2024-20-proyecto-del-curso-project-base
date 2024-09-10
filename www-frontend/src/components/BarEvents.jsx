import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, List, ListItem, ListItemText, Typography, Container, CircularProgress, Paper } from '@mui/material';

function BarEvents() {
  const [bars, setBars] = useState([]);
  const [selectedBar, setSelectedBar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loadingBars, setLoadingBars] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Obtener la lista de bares
  useEffect(() => {
    axios.get('/api/v1/bars')
      .then(response => {
        setBars(response.data.bars);
        setLoadingBars(false);
      })
      .catch(error => {
        console.error('Error fetching bars:', error);
        setLoadingBars(false);
      });
  }, []);

  // Filtrar los bares según el término de búsqueda
  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar la selección de un bar y cargar sus eventos
  const handleSelectBar = (bar) => {
    setSelectedBar(bar);
    setLoadingEvents(true);
    axios.get(`/api/v1/bars/${bar.id}/events`)
      .then(response => {
        setEvents(response.data.events);
        setLoadingEvents(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setLoadingEvents(false);
      });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Find a Bar and See Its Events</Typography>

      {/* Input para buscar un bar */}
      <TextField
        fullWidth
        variant="outlined"
        label="Search for a bar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />

      {/* Mostrar una animación de carga mientras se obtienen los bares */}
      {loadingBars ? (
        <CircularProgress />
      ) : (
        <Paper>
          {/* Lista de bares filtrados */}
          {filteredBars.length > 0 ? (
            <List>
              {filteredBars.map(bar => (
                <ListItem button key={bar.id} onClick={() => handleSelectBar(bar)}>
                  <ListItemText primary={bar.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No bars found.</Typography>
          )}
        </Paper>
      )}

      {/* Mostrar eventos si un bar ha sido seleccionado */}
      {selectedBar && (
        <div>
          <Typography variant="h5" gutterBottom>Events at {selectedBar.name}</Typography>
          {/* Mostrar una animación de carga mientras se obtienen los eventos */}
          {loadingEvents ? (
            <CircularProgress />
          ) : (
            <Paper>
              <List>
                {events.length > 0 ? (
                  events.map(event => (
                    <ListItem key={event.id}>
                      <ListItemText primary={event.name} />
                    </ListItem>
                  ))
                ) : (
                  <Typography>No events found for this bar.</Typography>
                )}
              </List>
            </Paper>
          )}
        </div>
      )}
    </Container>
  );
}

export default BarEvents;
