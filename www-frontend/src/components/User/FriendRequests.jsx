import React from 'react';
import { Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

function FriendRequests({ friendRequests }) {
  return (
    <>
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
                {/* Aquí puedes agregar botones para aceptar o rechazar solicitudes */}
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
