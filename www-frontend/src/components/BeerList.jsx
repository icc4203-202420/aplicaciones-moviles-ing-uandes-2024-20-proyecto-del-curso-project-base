import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../BeerList.css'; // Import the CSS file


function BeerList() {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const logUser = JSON.parse(localStorage.getItem('loguser')); // Logged-in user info


  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/beers')
      .then(response => {
        setBeers(response.data.beers); // Update state with beers data
      })
      .catch(error => {
        console.error('Error fetching the beers:', error);
      });
  }, []);


  // Filter beers based on the search term
  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="container">   
          <h2 className="heading">Lista de Bares</h2>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar cerveza..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
      <div className="beer-list-container">
        <ul className="beer-list">
          {filteredBeers.map(beer => (
            <Link to={`/beers/${beer.id}`} key={beer.id}>
              <ListItem key={beer.id} className="beer-list-item">
                <ListItemIcon>🍺
                </ListItemIcon>
                <ListItemText primary={beer.name} />
              </ListItem>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BeerList;