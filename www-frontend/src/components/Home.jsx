import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, Button, Paper } from '@mui/material';

function Home() {
  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <img
        src="/images/IMG_2759.JPG"
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
        }}
      />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo negro con opacidad 60%
        zIndex: -1,
      }} />
        <Typography variant="h2" gutterBottom sx={{ color: '#fff' }}>
          Welcome to Beer Explorer!
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
          Select an option below to get started:
        </Typography>
        <List>
          <ListItem>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#c28744', color: '#fff', '&:hover': { backgroundColor: '#a2743c' } }}
              component={Link}
              to="/beers"
              fullWidth
            >
              Beers
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#c28744', color: '#fff', '&:hover': { backgroundColor: '#a2743c' } }}
              component={Link}
              to="/bars"
              fullWidth
            >
              Bars
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#c28744', color: '#fff', '&:hover': { backgroundColor: '#a2743c' } }}
              component={Link}
              to="/bars/:id/events"
              fullWidth
            >
              Events
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#c28744', color: '#fff', '&:hover': { backgroundColor: '#a2743c' } }}
              component={Link}
              to="/users"
              fullWidth
            >
              Users
            </Button>
          </ListItem>
        </List>
    </div>
  );
}

export default Home;
