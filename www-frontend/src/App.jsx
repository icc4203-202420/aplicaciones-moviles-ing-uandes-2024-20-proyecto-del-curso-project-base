import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText 
} from '@mui/material';
import {
  PersonSearch,
  Campaign,
  Storefront,
  Menu,
  Search,
  SportsBar,
  Home
} from '@mui/icons-material'
import {
  useState,
  useEffect
} from 'react';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';

import './App.css';
import useLocalStorageState from 'use-local-storage-state';
import axiosInstance from './api/axios';

import HomePage from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Bars from './components/Bars';
import ShowBar from './components/ShowBar';
import Beers from './components/Beers';
import Events from './components/Events';
import ShowEvent from './components/ShowEvent';
import Users from './components/Users';
import ShowBeer from './components/ShowBeer';
import { Fragment } from 'react';

function App() {
  const [ open, setOpen ] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  }

  const [ token, setToken ] = useLocalStorageState('Tapp/Session/token', {defaultValue: ''});
  const [ isAuth, setIsAuth ] = useLocalStorageState('Tapp/Session/isAuth', { defaultValue: false });
  const [ signUp, setSignUp ] = useLocalStorageState('Tapp/signUp', { defaultValue: false });
  const [ currentUser, setCurrentUser ] = useLocalStorageState('Tapp/Session/currentUser', { defaultValue: {}});
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const pathNoAuth = ['/', '/login', '/signup', '/beers', '/bars'];
    console.log(isAuth)
    if (!isAuth && !pathNoAuth.includes(location.pathname))
      navigate('/login');
  }, [isAuth, location.pathname, navigate]);

  useEffect(() => {
    if (token) {
      axiosInstance.get('/login', {
        headers: { Authorization: {token} },
      })
      .then(() => {
        console.log('auth!')
        setIsAuth(true);
      })
      .catch(error => {
        console.error('Error during authentication:', error);
        setToken('');
        setIsAuth(false);
      });
    } else {
      setIsAuth(false);
    }
  }, [token]);

  const handleJWT = (token) => {
    setToken(token);
  }

  const handleCurrentUser = (user) => {
    setCurrentUser(user);
  }

  const handleLogout = () => {
    setToken('');
    setIsAuth(false);
    setCurrentUser('');
    navigate('/');
  }

  const handleSignUp = () => {
    setSignUp(!signUp);
  }

  const DrawerList = (
    <Drawer open={open} onClose={toggleDrawer}>
      <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
        <List>
          <ListItem key={'logout'} disablePadding>
            <ListItemButton onClick={() => {handleLogout(); toggleDrawer}}>
              <ListItemText primary={'Log out'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
  
  const handleSearch = () => {}

  return (
    <>
      {!isAuth? (
        !signUp? (
          <Login signUpHandler={handleSignUp} currentUserHandler={handleCurrentUser} tokenHandler={handleJWT} />
        ) : (
          <SignUp signUpHandler={handleSignUp} />
        )
      ) : (
        <Fragment>
          <AppBar id='top-app-bar' position='fixed' color='primary'>
            <Toolbar>
              <IconButton color='inherit' aria-label="drawer" onClick={toggleDrawer}>
                <Menu />
              </IconButton>
              {DrawerList}
              <IconButton color='inherit' aria-label="search" onClick={handleSearch}>
                <Search />
              </IconButton>
            </Toolbar>
          </AppBar>
        
          <AppBar id='bot-app-bar' position="fixed" color="primary">
            <Toolbar>
              <IconButton color="inherit" component={Link} to='/'>
                <Home style={{ fill: 'rgba(255, 255, 255, 0.75' }} />
              </IconButton>
              <IconButton color="inherit" component={Link} to='/beers'>
                <SportsBar style={{ fill: 'rgba(255, 255, 255, 0.75' }} />
              </IconButton>
              <IconButton color="inherit" component={Link} to='/bars'>
                <Storefront style={{ fill: 'rgba(255, 255, 255, 0.75' }} />
              </IconButton>
              {/* <IconButton color="inherit" component={Link} to='/events'>
                <Campaign style={{ fill: 'rgba(255, 255, 255, 0.75' }} />
              </IconButton> */}
              <IconButton color="inherit" component={Link} to='/users'>
                <PersonSearch style={{ fill: 'rgba(255, 255, 255, 0.75' }} />
              </IconButton>
            </Toolbar>
          </AppBar>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login signUpHandler={handleSignUp} tokenHandler={handleJWT} currentUserHandler={handleCurrentUser} />} />
            <Route path="/bars" element={<Bars />} />
            <Route path="/bars/:id" element={<ShowBar />} />
            <Route path="/beers" element={<Beers />} />
            <Route path="/beers/:id" element={<ShowBeer />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<ShowEvent />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </main>
      </Fragment>
      )}
      

    </>
  )
}

export default App;
