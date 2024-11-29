import React from 'react'
import SocialSearch from './SocialSearch'
import pintpalLogo from "../../assets/pintpal-logo.png";
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function SocialIndex() {

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    
    <>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
        <IconButton onClick={handleBackClick}>
          <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem', marginLeft: '-5rem' }} />
        </IconButton>
        <h2 style={{ margin: 0, color: 'black', fontSize: '2rem', fontWeight: 500 }}>PintPal</h2>
        <img src={pintpalLogo} alt="PintPal Logo" style={{ width: '50px', height: '50px' }} />
    </div>
    <SocialSearch/>
    </> 
  )
}
