import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';

import BarsIndex from './components/bars/BarsIndex';
import BarsDiscover from './components/bars/BarsDiscover';
import BarsShow from './components/bars/BarsShow';
import BarsMap from './components/bars/BarsMap';

import EventsShow from './components/events/EventsShow';
import EventsIndex from './components/events/EventsIndex';
import EventsUsers from './components/events/EventsUsers';
import EventPictureForm from './components/events/EventPictureForm';

import SocialIndex from './components/social/SocialIndex';
import SocialShow from './components/social/SocialShow';

import BeersIndex from './components/beers/BeersIndex';
import Signup from './components/Signup';
import Login from './components/Login';
import Logout from './components/Logout';
import BeersShow from './components/beers/BeersShow';

function CheckAuthentication({ element: Component }) {
  const isAuthenticated = !!localStorage.getItem('JWT_TOKEN');
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} /> 

        {/* Protected routes to JWT_TOKEN presence */}
        <Route path="/bars" element={<CheckAuthentication element={BarsIndex} />} />
        <Route path="/bars/discover" element={<CheckAuthentication element={BarsDiscover} />} />
        <Route path="/bars/locations" element={<CheckAuthentication element={BarsMap} />} />
        <Route path="/bars/:id" element={<CheckAuthentication element={BarsShow} />} />
        <Route path="/events/:id" element={<CheckAuthentication element={EventsShow} />} />
        <Route path="/events/:id/users" element={<CheckAuthentication element={EventsUsers} />} />
        <Route path="/events_pictures/new/event_id/:id" element={<CheckAuthentication element={EventPictureForm} />} />

        <Route path="/beers/:id" element={<CheckAuthentication element={BeersShow} />} />
        <Route path="/social" element={<CheckAuthentication element={SocialIndex} />} />
        <Route path="/users/:id" element={<CheckAuthentication element={SocialShow} />} />

        <Route path="/bars/:id/events" element={<CheckAuthentication element={EventsIndex} />} />
        <Route path="/beers" element={<CheckAuthentication element={BeersIndex} />} />
      </Routes>
    </Router>
  );
}

export default App;
