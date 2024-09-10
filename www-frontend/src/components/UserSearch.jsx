import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Container, Typography, Paper } from '@mui/material';
import axios from 'axios';

function UserSearch() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Llama a la API para obtener la lista de usuarios
    axios.get('/api/v1/users')
      .then(response => {
        console.log('Fetched users:', response.data);
        // Ajusta según la estructura real de la respuesta
        setUsers(Array.isArray(response.data.users) ? response.data.users : []);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const filteredUsers = users.filter(user => {
    const name = user.name || '';  // Usa una cadena vacía si user.name es undefined
    const handle = user.handle || '';  // Usa una cadena vacía si user.handle es undefined
  
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           handle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Usuarios
      </Typography>
      <TextField
        label="Buscar usuarios..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Paper>
        <List>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <ListItem key={user.id}>
                <ListItemText primary={user.name} secondary={`@${user.handle}`} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay usuarios disponibles" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default UserSearch;
