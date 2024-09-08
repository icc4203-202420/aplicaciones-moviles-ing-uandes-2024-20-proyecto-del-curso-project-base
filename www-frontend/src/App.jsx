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

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bars" element={<BarList />} />
          <Route path="/bars/:id/events" element={<BarEvents />} />
          <Route path="/users" element={<UserSearch />} />
          <Route path="/beers" element={<BeerList />} />
          <Route path="/beers" element={<BeerPopup />} />
          <Route path="/beers/:id" element={<BeerDetail />} />
          <Route path="/beers/:id/reviews" element={<BeerReviewList />} />
          <Route path="/beers/:id/review" element={<BeerReviewForm />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
