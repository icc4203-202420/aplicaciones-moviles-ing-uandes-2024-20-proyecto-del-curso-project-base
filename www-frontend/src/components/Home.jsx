import React from 'react';
import { AppBar,Button,ButtonGroup,Box,Toolbar,Container, Typography, IconButton, TextField, Tabs, Tab, Card, CardMedia, CardContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './HomeBares.css'; 
import { useNavigate } from 'react-router-dom';



const buttons = [
  <Button key="two">BeerMeApp</Button>,
];




function HomeBares() {
  return (

    <Container className="home-bares-container">
      {/* Header */}
        <Typography variant="h5" className="question">
        ¿Qué hay para <span className="highlight">beber</span> hoy?
        </Typography>
        <Box
      sx={{
        '& > *': {
          m: 1,
        },
      }}
    >
      <ButtonGroup orientation="vertical" aria-label="Vertical button group" sx={{
        border: '2px solid #FFDE59',
        '& .MuiButton-root': {
            color: '#FFDE59',
            border: 'none',
            '&:focus': {
              outline: 'none',}},
        '& .MuiButton-root + .MuiButton-root':
         {borderTop: '1px solid #FFDE59'} 
    }}>
        {buttons}
      </ButtonGroup>
      
     
  
    </Box>
        
    </Container>
    
  );
}

export default HomeBares;
