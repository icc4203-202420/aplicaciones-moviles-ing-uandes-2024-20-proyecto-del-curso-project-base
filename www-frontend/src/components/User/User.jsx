import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
  Paper,
  ListItemAvatar,
  Avatar,
  Tabs,
  Tab,
  Snackbar,
  IconButton
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function User({ barId = null }) { // Recibe barId como prop, con valor predeterminado null
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabIndex, setTabIndex] = useState(0); // Estado para las tabs
  const [toastOpen, setToastOpen] = useState(false); // Estado para el toast
  const [toastMessage, setToastMessage] = useState(''); // Mensaje del toast
  
  useEffect(() => {
    const userId = localStorage.getItem('CURRENT_USER_ID'); // Obtener userId del localStorage
  
    // Fetch users that attended the same event as the current user
    axios.get('/api/v1/users', {
      params: { attended_event: true }
    })
      .then(response => setUsers(response.data.users || []))
      .catch(error => console.error('Error fetching users:', error));
  
    // Fetch friend requests for the current user
    if (userId) {  // Asegúrate de que userId no sea null
      axios.get(`/api/v1/users/${userId}/friend_requests`)
        .then(response => setFriendRequests(response.data.friend_requests || []))
        .catch(error => console.error('Error fetching friend requests:', error));
    } else {
      console.error('No user ID found');
    }
  }, []);
  

  const handleAddFriend = (friendId) => {
    const token = localStorage.getItem('JWT_TOKEN');
    const userId = localStorage.getItem('CURRENT_USER_ID');

    console.log(`Adding friend with ID: ${friendId}`); // Verifica el ID aquí

    const requestBody = {
      friendship: {
        friend_id: friendId,
        bar_id: barId,
      },
    };

    axios.post(`/api/v1/users/${userId}/friendships`, requestBody, {
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
        toast.success('Friend request sent successfully!');
    })
    .catch(error => {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Unauthorized. Please log in again.');
          // Opcionalmente, redirigir al usuario a la página de inicio de sesión
        } else {
          toast.error('Failed to send friend request: ' + (error.response.data.error || 'An unknown error occurred'));
        }
      } else {
        console.error('Error adding friend:', error);
        toast.error('Failed to send friend request');
      }
    });
  };

  const filteredUsers = users.filter(user => {
    const handle = user.handle || '';
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase() || '';
    const eventNames = user.events?.map(event => event.name).join(', ').toLowerCase() || '';

    return handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
           fullName.includes(searchTerm.toLowerCase()) ||
           eventNames.includes(searchTerm.toLowerCase());
  });

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <Container
      maxWidth={false}
      sx={{ display: 'flex', flexDirection: 'column', height: '90vh', width: '70vh', padding: 0 }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <img
          src="/images/IMG_2756.JPG"
          alt="Background"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: -1 }} />
        <div style={{ position: 'relative', padding: '2vh 4vw', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h4" gutterBottom>Users</Typography>

          <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
            <Tab label="Search Users" />
            <Tab label="Friend Requests" />
          </Tabs>

          {tabIndex === 0 && (
            <>
              <TextField
                label="Search by handle, name or event"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonAddIcon sx={{ color: '#fff' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#fff' },
                    '&:hover fieldset': { borderColor: '#fff' },
                    '&.Mui-focused fieldset': { borderColor: '#fff' },
                    '& .MuiInputBase-input': { color: '#fff' },
                    '& .MuiInputLabel-root': { color: '#fff' },
                  },
                }}
              />

              <Paper sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', maxHeight: '65vh', overflowY: 'auto', marginTop: 2 }}>
                <List>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <ListItem key={user.id}>
                        <ListItemAvatar>
                          <Avatar><AccountCircle /></Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${user.first_name} ${user.last_name}`}
                          secondary={`@${user.handle} - Attended: ${user.events?.map(event => event.name).join(', ') || 'No events'}`}
                          sx={{
                            '& .MuiListItemText-primary': { color: '#fff' },
                            '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.6)' },
                          }}
                        />
                        <PersonAddIcon
                          sx={{ cursor: 'pointer', color: '#fff' }}
                          onClick={() => handleAddFriend(user.id)} // Llama a handleAddFriend sin barId
                        />
                      </ListItem>
                    ))
                  ) : (
                    <ListItem><ListItemText primary="No users available" /></ListItem>
                  )}
                </List>
              </Paper>
            </>
          )}

          {tabIndex === 1 && (
            <Paper sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', maxHeight: '65vh', overflowY: 'auto', marginTop: 2 }}>
              <List>
                {friendRequests.length > 0 ? (
                  friendRequests.map(request => (
                    <ListItem key={request.id}>
                      <ListItemAvatar>
                        <Avatar><AccountCircle /></Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${request.first_name} ${request.last_name}`}
                        secondary={`@${request.handle}`}
                        sx={{
                          '& .MuiListItemText-primary': { color: '#fff' },
                          '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.6)' },
                        }}
                      />
                      {/* Puedes añadir opciones para aceptar o rechazar la solicitud aquí */}
                    </ListItem>
                  ))
                ) : (
                  <ListItem><ListItemText primary="No friend requests" /></ListItem>
                )}
              </List>
            </Paper>
          )}

          {/* Toast notification */}
          <Snackbar
            open={toastOpen}
            autoHideDuration={6000}
            onClose={handleToastClose}
            message={toastMessage}
            action={
              <IconButton size="small" aria-label="close" onClick={handleToastClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </div>
      </div>
    </Container>
  );
}

export default User;
