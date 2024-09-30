import React, { useEffect, useState } from 'react';
import { Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';

function Friends() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('CURRENT_USER_ID');

    if (userId) {
      axios.get(`/api/v1/users/${userId}/friendships`, {
        headers: { 'Authorization': `${localStorage.getItem('JWT_TOKEN')}` } // Asegúrate de incluir 'Bearer'.
      })
        .then(response => {
          setFriends(response.data);  // Asegúrate de que la respuesta tenga la estructura correcta.
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching friends:', error);
        });
    }
  }, []);

  return (
    <Paper sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', maxHeight: '65vh', overflowY: 'auto', marginTop: 2 }}>
      <List>
        {friends.length > 0 ? (
          friends.map(friend => (
            <ListItem key={friend.id}>
              <ListItemAvatar>
                <Avatar alt={`${friend.first_name} ${friend.last_name}`} src={friend.avatar_url || '/default-avatar.png'}>
                  <AccountCircle />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${friend.first_name} ${friend.last_name}`}
                secondary={`@${friend.handle}`}
                sx={{
                  '& .MuiListItemText-primary': { color: '#fff' },
                  '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.6)' },
                }}
              />
            </ListItem>
          ))
        ) : (
          <ListItem><ListItemText primary="No friends available" /></ListItem>
        )}
      </List>
    </Paper>
  );
}

export default Friends;
