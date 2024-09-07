import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, Button, Paper } from '@mui/material';

function Home() {
  return (
    <Container
      component={Paper}
      elevation={3}
      sx={{
        padding: 4,
        marginTop: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo negro con opacidad 60%
        color: '#fff', // Color del texto blanco
      }}
    >
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
    </Container>
  );
}

export default Home;
