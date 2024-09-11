import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, List, ListItem, ListItemText, Typography, Container, CircularProgress, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify'; // Importa ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Estilos para el toast

function BarEvents() {
  const [bars, setBars] = useState([]);
  const [selectedBar, setSelectedBar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loadingBars, setLoadingBars] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attendees, setAttendees] = useState([]); // Estado para almacenar asistentes
  const [loadingAttendees, setLoadingAttendees] = useState(false); // Estado para la carga de asistentes

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

  // Manejar la selección de un evento y cargar los asistentes
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
    setLoadingAttendees(true);

    // Obtener los asistentes del evento
    axios.get(`/api/v1/events/${event.id}/attendees`)
      .then(response => {
        setAttendees(response.data.attendees);
        setLoadingAttendees(false);
      })
      .catch(error => {
        console.error('Error fetching attendees:', error);
        setLoadingAttendees(false);
      });
  };

  // Cerrar el diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
    setAttendees([]); // Limpiar los asistentes al cerrar el diálogo
  };

  // Realizar el check-in para el evento seleccionado
  const handleCheckIn = () => {
    if (selectedEvent) {
      axios.post(`/api/v1/events/${selectedEvent.id}/check_in`, { /* Puedes agregar datos adicionales aquí */ })
        .then(response => {
          // Actualiza la lista de eventos si es necesario
          setEvents(events.map(event =>
            event.id === selectedEvent.id ? { ...event, checked_in: true } : event
          ));
          toast.success('You have confirmed your attendance!'); // Notificación de éxito
          handleCloseDialog();
        })
        .catch(error => {
          toast.error('Error confirming your attendance!'); // Notificación de error
          console.error('Error checking in:', error);
        });
    }
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
                    <ListItem button key={event.id} onClick={() => handleEventClick(event)}>
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

      {/* Diálogo para mostrar detalles del evento */}
      {selectedEvent && (
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Event Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6">{selectedEvent.name}</Typography>
            <Typography>{selectedEvent.description}</Typography>
            <Typography>Date: {new Date(selectedEvent.date).toLocaleDateString()}</Typography>

            {/* Mostrar asistentes */}
            <Typography variant="h6" gutterBottom>Asistentes</Typography>
            {loadingAttendees ? (
              <CircularProgress />
            ) : (
              attendees.length > 0 ? (
                <List>
                  {attendees.map(attendee => (
                    <ListItem key={attendee.id}>
                      <ListItemText primary={`${attendee.first_name} ${attendee.last_name}`} secondary={`@${attendee.handle}`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No hay asistentes aún.</Typography>
              )
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Close</Button>
            {selectedEvent.checked_in ? (
              <Typography variant="body1" color="textSecondary">You have confirmed your attendance</Typography>
            ) : (
              <Button onClick={handleCheckIn} color="primary">Check-in</Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* Contenedor de notificaciones de Toast */}
      <ToastContainer />
    </Container>
  );
}

export default BarEvents;
