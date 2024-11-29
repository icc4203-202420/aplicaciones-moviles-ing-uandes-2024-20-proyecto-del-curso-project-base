import React from 'react';
import axios from 'axios';
import { Button, Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const JWT_TOKEN = localStorage.getItem('JWT_TOKEN');
    console.log(JWT_TOKEN);
    axios.delete(
      'http://localhost:3001/api/v1/logout', 
      {
        headers: {
          Authorization: `${JWT_TOKEN}`, 
        }
      }
    )
    .then(response => {
      console.log('User logged out successfully:', response.data);
      localStorage.removeItem('JWT_TOKEN');
      localStorage.removeItem('CURRENT_USER_ID');
      navigate('/login'); 
    })
    .catch(error => {
      console.log(JWT_TOKEN);
      console.error('Error logging out:', error);
    });
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5}>
        <Typography variant="h4" align="left" gutterBottom sx={{ color: 'black', fontWeight: 500 }}>
          Log Out
        </Typography>

        <Box mt={2} textAlign="center">
          <Typography variant="subtitle1" align="center" gutterBottom sx={{ color: 'grey', marginTop: 5 }}>
            Are you sure you want to log out?
          </Typography>

          <Button
            fullWidth
            onClick={handleLogout}
            sx={{
              background: 'linear-gradient(to right, #FFDB01, #FF8603)',
              color: 'white',
              padding: '10px',
              marginTop: '20px',
            }}
          >
            Log Out
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
