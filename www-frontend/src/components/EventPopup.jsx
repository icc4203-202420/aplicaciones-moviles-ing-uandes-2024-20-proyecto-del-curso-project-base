import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify'; // Mantenemos las comillas

function EventPopup({ event, open, onClose, onCheckIn }) {
  // Realizar el check-in para el evento seleccionado
  const handleCheckIn = () => {
    axios.post('/api/v1/events/${event.id}/check_in')
      .then(response => {
        onCheckIn(event.id); // Llama a la función onCheckIn para actualizar el estado de eventos
        onClose(); // Cierra el popup
        toast.success('Check-in successful!'); // Muestra la notificación de éxito
      })
      .catch(error => {
        console.error('Error checking in:', error);
        toast.error('Check-in failed.'); // Muestra una notificación de error
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Event Details</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{event.name}</Typography>
        <Typography>{event.description}</Typography>
        <Typography>Date: {new Date(event.date).toLocaleDateString()}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
        <Button onClick={handleCheckIn} color="primary">Check In</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EventPopup;