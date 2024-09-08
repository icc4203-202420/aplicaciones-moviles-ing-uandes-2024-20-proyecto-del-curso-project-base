import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import BeerIcon from '@mui/icons-material/LocalBar'; // Usando LocalBar como ejemplo
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from './contexts/AuthContext'; 
function Navbar() {
  const { isAuthenticated, logout } = useAuth(); // Desestructura isAuthenticated y logout

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
  };
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bottom: 0, 
        top: 'auto',
        backgroundColor: '#884017', // Cambia el color según tu diseño
        color: 'white',
        height: '64px', // Asegúrate de que coincida con el padding-bottom en tu CSS
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%'
        }}
      >
        <Button color="inherit" component={Link} to="/" sx={{ mx: 1 }}>
          <IconButton color="inherit">
            <HomeIcon />
          </IconButton>
          Home
        </Button>
        <Button color="inherit" component={Link} to="/bars" sx={{ mx: 1 }}>
          <IconButton color="inherit">
            <LocalBarIcon />
          </IconButton>
          Bars
        </Button>
        <Button color="inherit" component={Link} to="/beers" sx={{ mx: 1 }}>
          <IconButton color="inherit">
            <BeerIcon />
          </IconButton>
          Beers
        </Button>
        <Button color="inherit" component={Link} to="/bars/:id/events" sx={{ mx: 1 }}>
          <IconButton color="inherit">
            <EventIcon />
          </IconButton>
          Events
        </Button>
        <Button color="inherit" component={Link} to="/users" sx={{ mx: 1 }}>
          <IconButton color="inherit">
            <PersonIcon />
          </IconButton>
          Users
        </Button>

        {isAuthenticated ? (
          <Button color="inherit" onClick={handleLogout} sx={{ mx: 1 }}>
            <IconButton color="inherit">
              <PersonIcon />
            </IconButton>
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login" sx={{ mx: 1 }}>
            <IconButton color="inherit">
              <PersonIcon />
            </IconButton>
            Login
          </Button>
        )}

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
