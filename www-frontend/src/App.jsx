import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import Home from './components/Home';
import BarList from './components/BarList';
import BeerList from './components/Beer/BeerList';
import BarEvents from './components/BarEvents';
import UserSearch from './components/UserSearch';
import Navbar from './components/Navbar';

import BeerDetail from './components/Beer/BeerDetail';
import BeerPopup from './components/Beer/BeerPopup';
import BeerReviewForm from './components/Beer/BeerReviewForm';
import BeerReviewList from './components/Beer/BeerReviewList';

import Login from './components/Login';  // Importamos el formulario de login
import SignUp from './components/SignUp'; // Importamos el formulario de registro
import AuthProvider, { useAuth } from './components/contexts/AuthContext'; // Importamos el proveedor de autenticación

// Componente para proteger rutas privadas
function Authenticate({ element: Component }) {
  const isAuthenticated = !!localStorage.getItem('JWT_TOKEN');
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bars" element={<BarList />} />
            <Route path="/bars/:id/events" element={<BarEvents />} />
            <Route path="/users" element={<Authenticate element={UserSearch} />} /> 
            <Route path="/beers" element={<BeerList />} />
            <Route path="/beers/:id" element={<BeerDetail />} />
            <Route path="/beers/:id/reviews" element={<BeerReviewList />} />
            <Route path="/beers/:id/review" element={<Authenticate element={BeerReviewForm} />} /> 
            <Route path="/login" element={<Login />} /> 
            <Route path="/signup" element={<SignUp />} />
          </Routes>
          <Navbar />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
