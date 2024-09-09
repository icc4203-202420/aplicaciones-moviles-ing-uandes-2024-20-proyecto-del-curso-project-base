import React, { useState, useEffect } from 'react'; // Asegúrate de importar useState y useEffect
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import BeerIcon from '@mui/icons-material/LocalBar'; // Usando LocalBar como ejemplo
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import * as jwtDecode from 'jwt-decode'; 
import { useAuth } from './contexts/AuthContext'; 

function Navbar() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [userId, setUserId] = useState(null);
  // useEffect(() => {
  //   const checkAuth = () => {
  //     const token = localStorage.getItem('JWT_TOKEN');
  //     const currentUserId = localStorage.getItem('CURRENT_USER_ID');
  //     if (token && currentUserId) {
  //       setIsAuthenticated(true);
  //       setUserId(currentUserId);
  //     } else {
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   checkAuth();

  //   // Monitorear cambios en localStorage
  //   window.addEventListener('storage', checkAuth);

  //   // Limpiar el event listener
  //   return () => {
  //     window.removeEventListener('storage', checkAuth);
  //   };
  // }, []);
  // const token = localStorage.getItem('JWT_TOKEN');
  // const userId = localStorage.getItem('CURRENT_USER_ID');
  // const isAuthenticated = token && userId;

  // const handleLogout = () => {
  //   localStorage.removeItem('JWT_TOKEN');
  //   localStorage.removeItem('CURRENT_USER_ID');
  //   setIsAuthenticated(false);
  //   // window.location.reload();
  //   const navigate = useNavigate(); // Necesitarás llamar a useNavigate() aquí si decides redirigir
  // };
  const { isAuthenticated, logout } = useAuth();
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

        {isAuthenticated ? (
          <Button color="inherit" onClick={logout} sx={{ mx: 1 }}>
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
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;