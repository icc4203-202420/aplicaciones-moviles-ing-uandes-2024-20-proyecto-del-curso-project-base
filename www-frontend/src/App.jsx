import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import Home from './components/Home';
import BarList from './components/BarList';
import BeerList from './components/BeerList';
import BarEvents from './components/BarEvents';
import Navbar from './components/Navbar';


function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bar" element={<BarList />} />
          <Route path="/beer" element={<BeerList />} />
          <Route path="/events" element={<BarEvents />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;