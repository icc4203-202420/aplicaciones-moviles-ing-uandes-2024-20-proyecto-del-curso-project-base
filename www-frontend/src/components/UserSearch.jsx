import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, List, ListItem, ListItemText, Container, Typography, Paper, ListItemAvatar, Avatar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle'; 
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
    const name = user.first_name || '';  // Usa una cadena vacía si user.name es undefined
    const handle = user.handle || '';  // Usa una cadena vacía si user.handle es undefined
  
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           handle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '90vh',
        width: '70vh',
        padding: 0,
      }}
    >
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: -1,
        }} />
        <div style={{
          position: 'relative',
          padding: '2vh 4vw', // Ajustar padding para que sea proporcional a la vista
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Typography variant="h4" gutterBottom>
            Search Users
          </Typography>
          <TextField
            label="Search user"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonAddIcon sx={{ color: '#fff' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#fff', // Borde blanco
                },
                '&:hover fieldset': {
                  borderColor: '#fff', // Borde blanco al pasar el ratón
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#fff', // Borde blanco al enfocar
                },
                '& .MuiInputBase-input': {
                  color: '#fff', // Color del texto del campo
                },
                '& .MuiInputLabel-root': {
                  color: '#fff', // Color del texto de la etiqueta
                },
              },
            }}
          />
          <Paper
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              width: '100%',
              maxHeight: '65vh', // Altura máxima del contenedor de la lista
              overflowY: 'auto', // Habilita el scroll vertical
              marginTop: 2, // Espacio superior entre el campo de búsqueda y la lista
            }}
          >
            <List>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <ListItem key={user.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <AccountCircle /> 
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user.first_name} ${user.last_name}`} 
                      secondary={`@${user.handle}`}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: '#fff', // Color blanco para el texto primario
                        },
                        '& .MuiListItemText-secondary': {
                          color: 'rgba(255, 255, 255, 0.6)', // Blanco con opacidad del 60% para el texto secundario
                        },
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No users available" />
                </ListItem>
              )}
            </List>
          </Paper>
        </div>
      </div>
    </Container>
  );
}

export default UserSearch;
