import React, { useState } from 'react';
import { Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, Snackbar, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';

function UserSearch({ users, filteredUsers, handleAddFriend }) {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleClick = (userId) => {
    handleAddFriend(userId);
    setSnackbarMessage(`Friend request sent to user ID: ${userId}`);
    setOpenSnackbar(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

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
                <IconButton onClick={() => handleClick(user.id)}>
                  <PersonAddIcon sx={{ cursor: 'pointer', color: '#fff' }} />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <ListItem><ListItemText primary="No users available" /></ListItem>
          )}
        </List>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleClose}
        message={snackbarMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}

export default UserSearch;
