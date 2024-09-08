import React, { useState, useEffect } from 'react'; // Importa useState y useEffect desde React
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import BeerIcon from '@mui/icons-material/LocalBar'; // Usando LocalBar como ejemplo
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import useLocalStorageState from 'use-local-storage-state';
import axios from 'axios';
import * as jwtDecode from 'jwt-decode'; 
import LogoutIcon from '@mui/icons-material/Logout'; // Importar LogoutIcon si no está ya importado
import LoginIcon from '@mui/icons-material/Login'
function Navbar() {
  const [token, setToken] = useLocalStorageState('BeerApp/token', { defaultValue: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [handle, setHandle] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        setUsername(decodedToken.handle); // Asumiendo que el nombre del usuario está en el token
      } catch (error) {
        console.error('Error decoding token:', error);
        setToken('');
        setIsAuthenticated(false);
      }
    }
  }, [token, setToken]);

  const handleLogout = () => {
    axios.delete('http://localhost:3001/api/v1/logout', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      setToken('');
      setIsAuthenticated(false);
      setHandle('');
      navigate('/login');
    })
    .catch((error) => {
      console.error('Error during logout:', error);
    });
  };
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bottom: 0, 
        top: 'auto',
        backgroundColor: '#884017',
        color: 'white',
        height: '64px', 
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

        {/* {isAuthenticated ? (
          <Button color="inherit" onClick={handleLogout} sx={{ mx: 1 }}>
            <IconButton color="inherit">
              <LogoutIcon />
            </IconButton>
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login" sx={{ mx: 1 }}>
            <IconButton color="inherit">
              <LoginIcon />
            </IconButton>
            Login
          </Button>
        )} */}

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
