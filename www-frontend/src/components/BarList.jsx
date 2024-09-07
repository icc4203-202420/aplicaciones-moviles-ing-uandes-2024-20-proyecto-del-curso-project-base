import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Container, Typography, Paper } from '@mui/material';
import axios from 'axios';

function BarList() {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Llama a la API para obtener la lista de bares
    axios.get('/api/v1/bars')
      .then(response => {
        // Verifica la estructura de la respuesta
        console.log('Fetched bars:', response.data);
        setBars(response.data.bars); // Asegúrate de que response.data.bars sea la estructura correcta
      })
      .catch(error => console.error('Error fetching bars:', error));
  }, []);

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Bares
      </Typography>
      <TextField
        label="Buscar bares..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Paper>
        <List>
          {filteredBars.length > 0 ? (
            filteredBars.map(bar => (
              <ListItem key={bar.id}>
                <ListItemText primary={bar.name} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay bares disponibles" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default BarList;
