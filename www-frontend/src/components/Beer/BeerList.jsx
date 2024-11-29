import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, TextField, Paper, IconButton, CircularProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
      backgroundColor: '#D6A96D', // Fondo del contenedor principal
      height: '100vh',
      overflowY: 'auto',
      padding: '20px',
    }}>
      <TextField
        label="Search beers"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          backgroundColor: '#F0DAAE', // Color de fondo del buscador
          borderRadius: '10px',
          '& .MuiInputBase-root': {
            color: '#452216', // Color del texto del input
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#452216', // Color del borde
            },
            '&:hover fieldset': {
              borderColor: '#452216',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#452216',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#452216', // Color de la etiqueta
          },
        }}
      />
      <Paper sx={{ backgroundColor: '#D6A96D', padding: '10px' }}>
        <List>
          {filteredBeers.length > 0 ? (
            filteredBeers.map(beer => (
              <ListItem
                key={beer.id}
                button
                onClick={() => handleBeerClick(beer)}
                sx={{
                  backgroundColor: '#F0DAAE', // Fondo de los ítems
                  marginBottom: '10px',
                  borderRadius: '10px', // Bordes redondeados como en el diseño
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Sombra sutil
                }}
              >
                <ListItemText
                  primary={beer.name}
                  primaryTypographyProps={{
                    color: '#452216', // Color del nombre de la cerveza
                    fontWeight: 'bold',
                  }}
                  secondary={
                    <Typography sx={{ color: '#452216' }}>
                      {beer.style}
                    </Typography>
                  }
                />
                <IconButton edge="end" aria-label="more">
                  <MoreVertIcon sx={{ color: '#452216' }} />
                </IconButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay cervezas disponibles" sx={{ color: '#452216' }} />
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
  );
};

export default BeerList;