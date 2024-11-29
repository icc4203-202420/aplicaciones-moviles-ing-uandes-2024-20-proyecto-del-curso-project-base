import axios from 'axios';
import React, { useEffect, useState } from 'react';
import pintpalLogo from "../../assets/pintpal-logo.png";
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchBar from '../SearchBar';
import BeersIndexCard from './BeersIndexCard';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function BeersIndex() {
  const [beers, setBeers] = useState([]); 
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/beers')
      .then(response => {
        setBeers(response.data.beers);
      });
    }, 
  []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    beer.style.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      {/* PintPal superior con el logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
        {/* Flecha para ir hacia atras */}
        <IconButton onClick={handleBackClick}>
          <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem', marginLeft: '-5rem' }} />
        </IconButton>
        <h2 style={{ margin: 0, color: 'black', fontSize: '2rem', fontWeight: 500 }}>PintPal</h2>
        <img src={pintpalLogo} alt="PintPal Logo" style={{ width: '50px', height: '50px' }} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <SearchBar value={searchText} onChange={handleSearchChange} />
      </div>

      <div>
        {filteredBeers.length > 0 ? (
          filteredBeers.map(beer => (
            <Link key={beer.id} to={`/beers/${beer.id}`} style={{ textDecoration: 'none' }}>
              <BeersIndexCard beers={beer} />
            </Link>
          ))
        ) : (
          <Typography variant="body1" style={{ marginTop: 10, color: 'gray' }}>
            No beers found.
          </Typography>
        )}

      </div>
    </>
  );
}

export default BeersIndex;
