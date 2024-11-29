import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Divider, Button, List, ListItem, ListItemText } from '@mui/material';
import api from '../api';

function EventInfo() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState({ friends: [], others: [] });
  const [isAttending, setIsAttending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${eventId}`);
        setEvent(response.data.event);

        const currentUserId = localStorage.getItem('userId');
        const checkAttendance = await api.get(`/events/${eventId}/attendees`);
        const hasCheckedIn = checkAttendance.data.friends.concat(checkAttendance.data.others)
          .some(user => user.id === parseInt(currentUserId));
        setIsAttending(hasCheckedIn);

        setAttendees(checkAttendance.data);
      } catch (err) {
        console.error('Error fetching event details or attendees:', err);
        setError('Error al cargar los detalles del evento o la lista de asistentes');
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleCheckIn = async () => {
    try {
      await api.post(`/events/${eventId}/check_in`);
      setIsAttending(true); 
    } catch (err) {
      console.error('Error checking in:', err);
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!event) {
    return (
      <Container>
        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        <Typography>Cargando los detalles del evento...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>{event.name}</Typography>
      <Typography variant="h6" color="textSecondary">
        {new Date(event.date).toLocaleString()}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1">{event.description}</Typography>

      <Divider sx={{ my: 2 }} />

      {isAttending ? (
        <Typography variant="h6" color="success.main">Ya has confirmado tu asistencia.</Typography>
      ) : (
        <Button variant="contained" color="primary" onClick={handleCheckIn}>
          Confirmar asistencia
        </Button>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h5" gutterBottom>Asistentes</Typography>

      <Typography variant="h6">Amigos</Typography>
      <List>
        {attendees.friends.length > 0 ? (
          attendees.friends.map(friend => (
            <ListItem key={friend.id}>
              <ListItemText primary={`@${friend.handle}`} />
            </ListItem>
          ))
        ) : (
          <Typography>No hay amigos confirmados.</Typography>
        )}
      </List>

      <Typography variant="h6">Otros asistentes</Typography>
      <List>
        {attendees.others.length > 0 ? (
          attendees.others.map(other => (
            <ListItem key={other.id}>
              <ListItemText primary={`@${other.handle}`} />
            </ListItem>
          ))
        ) : (
          <Typography>No hay otros asistentes confirmados.</Typography>
        )}
      </List>
    </Container>
  );
}

export default EventInfo;
