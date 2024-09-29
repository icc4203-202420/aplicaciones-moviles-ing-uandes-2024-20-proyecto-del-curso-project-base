import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import Home from './components/Home';
import BarSearch from './components/Bar/BarSearch';
import BarEvents from './components/Bar/Events/BarEvents';
import UserSearch from './components/UserSearch';
import BeerList from './components/Beer/BeerList';
import BeerDetail from './components/Beer/BeerDetail';
import BeerReviewList from './components/Beer/BeerReviewList';
import BeerReviewForm from './components/Beer/BeerReviewForm';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Account from './components/Account'; 
import AuthProvider from './components/contexts/AuthContext';
import { CheckInProvider } from './components/contexts/CheckInContext'; // Importa el CheckInProvider
import { Navigate } from 'react-router-dom';

// Nuevas importaciones
import EventGallery from './components/Bar/Events/EventGallery';
import FriendSearch from './components/FriendSearch';
import TagUserInPicture from './components/Bar/Events/TagUserInPicture';

function Authenticate({ element: Component }) {
  const isAuthenticated = !!localStorage.getItem('JWT_TOKEN');
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <CheckInProvider> {/* Envuelve tu aplicación con CheckInProvider */}
        <Router>
          <div className="app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bars" element={<BarSearch />} />
              <Route path="/bars/:id/events" element={<BarEvents />} />
              <Route path="/users" element={<Authenticate element={UserSearch} />} />
              <Route path="/beers" element={<BeerList />} />
              <Route path="/beers/:id" element={<BeerDetail />} />
              <Route path="/beers/:id/reviews" element={<BeerReviewList />} />
              <Route path="/beers/:id/review" element={<Authenticate element={BeerReviewForm} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/account" element={<Account />} />

              {/* Nuevas rutas */}
              <Route path="/bars/:barId/events/:eventId/gallery" element={<EventGallery />} />
              <Route path="/search/friends" element={<Authenticate element={FriendSearch} />} />
              <Route path="/event/:eventId/picture/:pictureId/tag" element={<Authenticate element={TagUserInPicture} />} />
            </Routes>
            <Navbar />
            <ToastContainer />
          </div>
        </Router>
      </CheckInProvider>
    </AuthProvider>
  );
}

export default App;
