import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, TextField, Paper, CircularProgress } from '@mui/material';
import BeerPopup from './BeerPopup'; // Asegúrate de que la ruta sea correcta

const BeerList = () => {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/beers')
      .then(response => {
        setBeers(response.data.beers || []); // Asegúrate de que sea un array
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching beers:', error);
        setError('Failed to load beers');
        setLoading(false);
      });
  }, []);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBeerClick = (beer) => {
    setSelectedBeer(beer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBeer(null);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      margin: 0,
      overflow: 'hidden',
    }}>
      <img
        src="/images/IMG_2756.JPG"
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
        }}
      />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo negro con opacidad 60%
        zIndex: -1,
      }} />
      <div style={{
        position: 'relative',
        padding: '20px',
        zIndex: 1,
      }}>
        <Typography variant="h4" gutterBottom color="white">
          Search a Beer
        </Typography>
        <TextField
          label="Search beers"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ color: 'white', '& .MuiInputLabel-root': { color: 'white' }, '& .MuiInputBase-root': { color: 'white' } }}
        />
        <Paper sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: '10px', marginTop: '20px', color: 'white' }}>
          <List>
            {filteredBeers.length > 0 ? (
              filteredBeers.map(beer => (
                <ListItem button key={beer.id} onClick={() => handleBeerClick(beer)}>
                  <ListItemText
                    primary={beer.name}
                    secondary={
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {beer.style}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No hay cervezas disponibles" sx={{ color: 'white' }} />
              </ListItem>
            )}
          </List>
        </Paper>

        {selectedBeer && (
          <BeerPopup
            open={openDialog}
            onClose={handleCloseDialog}
            beer={selectedBeer}
          />
        )}
      </div>
    </div>
  );
};

export default BeerList;
