import React from 'react';
import pintpalLogo from './assets/pintpal-logo.png';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchBar from '../SearchBar';
import BarsDiscoverLocationCard from './BarsDiscoverLocationCard';
import { useNavigate } from 'react-router-dom';

export default function BarsDiscover() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  const handleSearchBarClick = () => {
    navigate('/bars');
  };

  return (
    <>
      {/* PintPal superior con el logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom: '30px' }}>
        <IconButton onClick={handleBackClick}>
          <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem', marginLeft: '-5rem' }} />
        </IconButton>
        <h2 style={{ margin: 0, color: 'black', fontSize: '2rem', fontWeight: 500 }}>PintPal</h2>
        <img src={pintpalLogo} alt="PintPal Logo" style={{ width: '50px', height: '50px' }} />
      </div>

      {/* Search by name */}
      {/* <h3 style={{color:'black'}}>/bars</h3> */}
      <div 
        style={{ marginBottom: '20px', cursor: 'pointer' }}
        onClick={handleSearchBarClick}
      >
        <SearchBar/>
      </div>


    {/* Search by location */}
    {/* <h3 style={{color:'black'}}>/bars/locations</h3> */}
    <div style={{ marginBottom: '20px', cursor: 'pointer' }}>
        <BarsDiscoverLocationCard/>
      </div>

      
    </>
  );
}
