import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <h2>Welcome to Beer Explorer!</h2>
      <p>Select an option below to get started:</p>
      <ul>
        <li><Link to="/beers">Browse Beers</Link></li>
        <li><Link to="/bars">Find Bars</Link></li>
        <li><Link to="/bars/:id/events">Find Bar Events</Link></li>
        <li><Link to="/search">Search Users</Link></li>
        <li><Link to="/events">Events </Link></li> 
      </ul>
    </div>
  );
}

export default Home;