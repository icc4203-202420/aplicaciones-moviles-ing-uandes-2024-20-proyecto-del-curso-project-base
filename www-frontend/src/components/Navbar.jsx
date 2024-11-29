import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

// eslint-disable-next-line react/prop-types
function Navbar({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setIsAuthenticated(false);
        navigate('/signin');
        return;
      }

      await api.delete('/logout', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      // Incluso si hay un error, eliminamos el token y cerramos la sesión
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/signin');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Beer App
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/beers">Beers</Button>
        <Button color="inherit" component={Link} to="/bars">Bars</Button>
        <Button color="inherit" component={Link} to="/search-users">Search Users</Button>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
