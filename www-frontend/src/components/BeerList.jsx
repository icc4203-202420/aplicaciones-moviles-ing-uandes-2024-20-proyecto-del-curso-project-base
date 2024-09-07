import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Container, Typography, Paper } from '@mui/material';
import axios from 'axios';

function BeerList() {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/v1/beers')
      .then(response => setBeers(response.data.beers))
      .catch(error => console.error('Error fetching beers:', error));
  }, []);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Cervezas
      </Typography>
      <TextField
        label="Buscar cervezas..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Paper>
        <List>
          {filteredBeers.length > 0 ? (
            filteredBeers.map(beer => (
              <ListItem key={beer.id}>
                <ListItemText primary={beer.name} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay cervezas disponibles" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default BeerList;
