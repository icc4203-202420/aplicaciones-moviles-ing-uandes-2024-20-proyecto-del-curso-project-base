import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/bars">Bars</Link></li>
        <li><Link to="/beers">Beers</Link></li>
        <li><Link to="/events">Events</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;