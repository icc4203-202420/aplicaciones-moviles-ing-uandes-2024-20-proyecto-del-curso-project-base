import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Link, Routes, Route } from 'react-router-dom';
import CottageIcon from '@mui/icons-material/Cottage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';


import './App.css';

import BeerDetail from './components/BeerDetail';
import FriendList from './components/FriendList';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import BeerList from './components/BeerList'; 
import BarList from './components/BarList'; 
import BarEventsList from './components/BarEventsList'; 
import Beer from './assets/beer.svg';
import Map from './components/Map';
import BarDetail from './components/BarDetail';
import EventPictureUpload from './components/EventPictureUpload';
import EventDetail from './components/EventDetail'; 

function App() {
  const navigate = useNavigate();
  const [loguser, setLogUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };



  const logout = () => { 
    localStorage.removeItem('loguser');
    setLogUser(null);
    navigate("/login");

  }

  return (
    <>
      <AppBar position="fixed" className="appbar" sx={{ backgroundColor: "#DABB3F" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <img src={Beer} alt="beer-icon" className="beer-icon" />
          </IconButton>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }} className='appname'>
            BeerMeApp
          </Typography>

          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
            <List>
              {loguser ? (
                <ListItem>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <Typography variant="h4" component="div" sx={{ flexGrow: 1 }} className='username'>
                    {loguser.first_name}
                  </Typography>
                </ListItem>
              ) : null}
              <ListItem button component={Link} to="/">
                <ListItemIcon>
                  <CottageIcon />
                </ListItemIcon>
                <ListItemText primary="Home" className="Text_nav" />
              </ListItem>
              <ListItem button component={Link} to="/beers">
                <ListItemIcon>
                  <CottageIcon />
                </ListItemIcon>
                <ListItemText primary="Cervezas" className="Text_nav" />
              </ListItem>
              <ListItem button component={Link} to="/bars">
                <ListItemIcon>
                  <CottageIcon />
                </ListItemIcon>
                <ListItemText primary="Bares" className="Text_nav" />
              </ListItem>
              <ListItem button component={Link} to="/events">
                <ListItemIcon>
                  <CottageIcon />
                </ListItemIcon>
                <ListItemText primary="Eventos" className="Text_nav" />
              </ListItem>
              <ListItem button component={Link} to="/friends">
                <ListItemIcon>
                  <CottageIcon />
                </ListItemIcon>
                <ListItemText primary="Amigos" className="Text_nav" />
              </ListItem>
              <ListItem button component={Link} to="/map">
                <ListItemIcon>
                  <CottageIcon />
                </ListItemIcon>
                <ListItemText primary="Mapa" className="Text_nav" />
              </ListItem>
              {loguser ? (
                <ListItem button onClick={logout}>
                  <ListItemIcon>
                    <CottageIcon />
                  </ListItemIcon>
                  <ListItemText primary="Cerrar sesión" className="Text_nav" />
                </ListItem>
              ) : (
                <>
                  <ListItem button component={Link} to="/login">
                    <ListItemIcon>
                      <CottageIcon />
                    </ListItemIcon>
                    <ListItemText primary="Iniciar sesión" className="Text_nav" />
                  </ListItem>
                  <ListItem button component={Link} to="/signup">
                    <ListItemIcon>
                      <CottageIcon />
                    </ListItemIcon>
                    <ListItemText primary="Registrarse" className="Text_nav" />
                  </ListItem>
                </>
              )}
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>

      {/* Aquí ajustamos el contenido principal para que esté debajo de la AppBar */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/beers" element={<BeerList />} />
          <Route path="/bars" element={<BarList />} /> 
          <Route path="/events" element={<BarEventsList />} />
          <Route path="/friends" element={<FriendList />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setLogUser={setLogUser}/>} />
          <Route path="/beers/:id" element={<BeerDetail />} />
          <Route path="/map" element={<Map />} />
          <Route path="/bars/:barId" element={<BarDetail />} />
          <Route path="/bars/:barId/events/:id" element={<EventDetail />} /> {/* Ruta para detalles del evento */}
          <Route path="/bars/:barId/events/:id/event_pictures" element={<EventPictureUpload />} /> {/* Ruta para subir fotos */}
        </Routes>
      </div>
    </>
  );
}

export default App;