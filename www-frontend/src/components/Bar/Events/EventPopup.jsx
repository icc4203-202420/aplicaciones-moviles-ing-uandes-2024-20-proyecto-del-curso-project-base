import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Dialog, DialogContent, DialogActions, ListItemAvatar, Avatar, CircularProgress, Card, CardActions, CardContent, Button } from '@mui/material';
import { toast } from 'react-toastify';
import AccountCircle from '@mui/icons-material/AccountCircle'; 
import { useCheckIn } from '../../contexts/CheckInContext';
import { useAuth } from '../../contexts/AuthContext'; 

function EventPopup({ open, onClose, event, onCheckIn }) {
  const { isAuthenticated, token } = useAuth();
  const { checkIns, updateCheckIn } = useCheckIn(); 
  const [attendees, setAttendees] = useState([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const currentUserId = localStorage.getItem('CURRENT_USER_ID'); // Obtén el currentUserId del localStorage
  
  useEffect(() => {
    if (open && event) {
      setLoadingAttendees(true);
      axios.get(`/api/v1/events/${event.id}/attendees`)
        .then(response => {
          const fetchedAttendees = response.data.attendees;
          console.log('Fetched attendees:', fetchedAttendees); // Debug
          setAttendees(fetchedAttendees);
          setLoadingAttendees(false);

          const userIsAttending = fetchedAttendees.some(attendee => Number(attendee.id) === Number(currentUserId));
          console.log('Is user attending?', userIsAttending); // Debug
          setCheckedIn(userIsAttending);
        })
        .catch(error => {
          console.error('Error fetching attendees:', error);
          setLoadingAttendees(false);
        });
    }
  }, [open, event, currentUserId]);

  useEffect(() => {
    setCheckedIn(checkIns[event?.id] || false);
  }, [checkIns, event]);

  const fetchUserDetails = async (userId) => {
    try {
      console.log('Fetching details for user:', userId); // Debug
      const response = await axios.get(`/api/v1/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('User details fetched:', response.data); // Debug
      return response.data; // Asume que la respuesta tiene first_name, last_name, handle
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };
  
  const handleCheckIn = async () => {
    if (!isAuthenticated || !token) {
      toast.error('You must be logged in to check in.');
      console.log('User is not authenticated or token is missing');
      return;
    }
  
    try {
      console.log('Starting check-in process...');
  
      // Obtén los detalles del usuario
      const userDetails = await fetchUserDetails(currentUserId);
      console.log('User details fetched:', userDetails); // Debug
  
      if (!userDetails) {
        toast.error('Could not fetch user details.');
        console.log('User details not found');
        return;
      }
  
      // Realiza el check-in
      console.log('Performing check-in...');
      const checkInResponse = await axios.post(`/api/v1/events/${event.id}/check_in`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Check-in response:', checkInResponse);

      // Actualiza la lista de asistentes
      console.log('Fetching updated attendees...');
      const response = await axios.get(`/api/v1/events/${event.id}/attendees`);
      console.log('Fetched attendees:', response.data.attendees); // Debug
      setAttendees(response.data.attendees);

    //   setAttendees(prevAttendees => {
    //   const newAttendee = {
    //     id: currentUserId,
    //     first_name: userDetails.first_name,
    //     last_name: userDetails.last_name,
    //     handle: userDetails.handle
    //   };
    //   const updatedAttendees = [...prevAttendees, newAttendee];
    //   console.log('Updated attendees list:', updatedAttendees);
    //   return updatedAttendees;
    // });
  
      setCheckedIn(true);
      updateCheckIn(event.id, true);
      toast.success('You have confirmed your attendance!');
      if (onCheckIn) onCheckIn();
  
    } catch (error) {
      console.error('Error during check-in:', error);
      toast.error('Check-in failed.');
    }
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
            {checkedIn ? (
              <Typography variant="body1" color="textSecondary">Already Checked-in</Typography>
            ) : (
              <Button onClick={handleCheckIn} color="primary">Check-in</Button>
            )}
          </CardActions>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default EventPopup;
