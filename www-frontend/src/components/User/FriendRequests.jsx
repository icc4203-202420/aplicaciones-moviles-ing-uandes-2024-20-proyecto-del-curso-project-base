import React, { useState } from 'react';
import { Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FriendRequests({ friendRequests, fetchFriendRequests }) {
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('CURRENT_USER_ID');

  const handleAccept = async (requestId) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/v1/users/${userId}/friend_requests/${requestId}/accept`);
      toast.success(response.data.message);
      fetchFriendRequests();
    } catch (error) {
      // Muestra el error completo en consola para diagnosticar
      console.error('Error accepting friend request', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Error accepting friend request');
    } finally {
      setLoading(false);
    }
  };
    
  const handleReject = async (requestId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/v1/users/${userId}/friend_requests/${requestId}/reject`);
      toast.success('Friend request rejected!');
      fetchFriendRequests(); // Actualiza la lista de solicitudes de amistad
    } catch (error) {
      toast.error('Error rejecting friend request');
      console.error('Error rejecting friend request', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Paper sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', maxHeight: '65vh', overflowY: 'auto', marginTop: 2 }}>
        <List>
          {friendRequests.length > 0 ? (
            friendRequests.map(request => (
              <ListItem key={request.id}>
                <ListItemAvatar>
                  <Avatar><AccountCircle /></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${request.user.first_name} ${request.user.last_name}`}
                  secondary={`@${request.user.handle}`}
                  sx={{
                    '& .MuiListItemText-primary': { color: '#fff' },
                    '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.6)' },
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleAccept(request.id)} 
                  sx={{ marginRight: 1 }}
                  disabled={loading}
                >
                  Accept
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => handleReject(request.id)}
                  disabled={loading}
                >
                  Reject
                </Button>
              </ListItem>
            ))
          ) : (
            <ListItem><ListItemText primary="No friend requests" /></ListItem>
          )}
        </List>
      </Paper>
    </>
  );
}

export default FriendRequests;
