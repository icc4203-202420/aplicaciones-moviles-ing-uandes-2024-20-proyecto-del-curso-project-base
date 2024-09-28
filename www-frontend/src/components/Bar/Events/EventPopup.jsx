import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Dialog, DialogContent, DialogActions, ListItemAvatar, Avatar, CircularProgress, Card, CardActions, CardContent, Button } from '@mui/material';
import { toast } from 'react-toastify';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useCheckIn } from '../../contexts/CheckInContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function EventPopup({ open, onClose, event, onCheckIn }) {
  const { isAuthenticated, token } = useAuth();
  const { checkIns, updateCheckIn } = useCheckIn();
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [checkedIn, setCheckedIn] = useState(checkIns[event?.id] || false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (event) {
      setLoadingAttendees(true);
      axios.get(`/api/v1/events/${event.id}/attendees`)
        .then(response => {
          setAttendees(response.data.attendees);
          setLoadingAttendees(false);
        })
        .catch(error => {
          console.error('Error fetching attendees:', error);
          setLoadingAttendees(false);
        });
    }
  }, [event]);

  useEffect(() => {
    setCheckedIn(checkIns[event?.id] || false);
  }, [checkIns, event]);

  const handleCheckIn = async () => {
    if (!isAuthenticated || !token) {
      toast.error('You must be logged in to check in.');
      return;
    }

    try {
      await axios.post(`/api/v1/events/${event.id}/check_in`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      updateCheckIn(event.id, true);
      setCheckedIn(true);
      toast.success('Check-in successful!');
      if (onCheckIn) onCheckIn();
    } catch (error) {
      console.error('Error during check-in:', error);
      toast.error('Check-in failed.');
    }
  };

  const handleViewGallery = () => {
    navigate(`/bars/${event.bar_id}/events/${event.id}/gallery`);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ style: { backgroundColor: 'transparent', boxShadow: 'none', borderRadius: 4 } }}>
      <DialogContent>
        <Card sx={{ width: '100%', maxWidth: 700, margin: 'auto' }}>
          <CardContent sx={{ margin: '12px' }}>
            <Typography variant="h5">{event.name}</Typography>
            <Typography variant="body1">{event.description}</Typography>
            <Typography variant="body2">Date: {new Date(event.date).toLocaleDateString()}</Typography>
            <Typography variant="body2">Start Date: {new Date(event.start_date).toLocaleDateString()}</Typography>
            <Typography variant="body2">End Date: {new Date(event.end_date).toLocaleDateString()}</Typography>

            <Typography variant="h6" gutterBottom>Attendees</Typography>
            {loadingAttendees ? (
              <CircularProgress />
            ) : (
              attendees.length > 0 ? (
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {attendees.map(attendee => (
                    <ListItem key={attendee.id} sx={{ py: 1, px: 0 }}>
                      <ListItemAvatar>
                        <Avatar>
                          <AccountCircle />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={`${attendee.first_name} ${attendee.last_name}`} secondary={`@${attendee.handle}`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No attendees yet.</Typography>
              )
            )}
          </CardContent>
          <CardActions>
            <Button onClick={onClose} color="primary">Close</Button>
            {!checkedIn && (
              <Button onClick={handleCheckIn} color="primary">Check-in</Button>
            )}
            <Button onClick={handleViewGallery} color="secondary" variant="outlined">
              Ver todas las imágenes
            </Button>
          </CardActions>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default EventPopup;
