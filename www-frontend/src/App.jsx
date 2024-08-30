import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import Home from './components/Home';
import BarList from './components/BarList';
import BeerList from './components/BeerList';
import BarEvents from './components/BarEvents';
import UserSearch from './components/UserSearch';
import EventList from './components/EventList';
import Navbar from './components/Navbar';


function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bars" element={<BarList />} />
          <Route path="/beers" element={<BeerList />} />
          <Route path="/bars/:id/events" element={<BarEvents />} />
          <Route path="/search" element={<UserSearch />} />
          <Route path="/events" element={<EventList />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;