import React from 'react';
import { Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function UserSearch({ users, filteredUsers, handleAddFriend }) {
  return (
    <>
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
  );
}

export default UserSearch;
