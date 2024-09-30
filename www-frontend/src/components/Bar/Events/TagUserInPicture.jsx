import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { toast } from 'react-toastify';

const TagUserInPicture = ({ eventId, pictureId, onClose }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar usuarios desde el backend
  const fetchUsers = async (query = '') => {
    const token = localStorage.getItem('JWT_TOKEN');
    if (!token) {
      toast.error('Usuario no autenticado. Por favor, inicia sesión.');
      return;
    }

    try {
      console.log('Fetching users with query:', query);
      const response = await axios.get(`/api/v1/users?search=${query}`, {
        headers: {
          Authorization: `${token}`, // Añadir el token en los headers para la autorización
        },
      });
      console.log('Users fetched:', response.data.users);
      setUsers(response.data.users || []);
      setFilteredUsers(response.data.users || []); // Actualizamos filteredUsers también
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error);
      toast.error('Error al buscar usuarios. Verifica la conexión.');
    }
  };

  // Cargar todos los usuarios al inicio
  useEffect(() => {
    fetchUsers();
  }, []);

  // Manejar la etiqueta de usuario
  const handleTagUser = async () => {
    if (!selectedUser) {
      toast.error('Por favor, selecciona un usuario para etiquetar.');
      return;
    }
  
    const token = localStorage.getItem('JWT_TOKEN');
    if (!token) {
      toast.error('Usuario no autenticado. Por favor, inicia sesión.');
      return;
    }
  
    console.log('Tagging user:', selectedUser, 'in picture:', pictureId);
    try {
      // Enviar el user_id en la solicitud POST
      await axios.post(
        `/api/v1/events/${eventId}/event_pictures/${pictureId}/tag_user`,
        {
          user_id: selectedUser.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Usuario etiquetado con éxito.');
      onClose();
    } catch (error) {
      console.error('Error al etiquetar al usuario:', error);
      toast.error('No se pudo etiquetar al usuario. Inténtalo de nuevo.');
    }
  };
  

  // Manejar la selección de un usuario
  const handleSelectUser = (user) => {
    console.log('User selected for tagging:', user);
    setSelectedUser(user);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Etiquetar usuario en la imagen</DialogTitle>
      <DialogContent>
        {/* Campo de búsqueda */}
        <TextField
          label="Buscar usuario"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            fetchUsers(value);
          }}
        />
        <Paper
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            width: '100%',
            maxHeight: '65vh',
            overflowY: 'auto',
            marginTop: 2,
          }}
        >
          <List>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <ListItem key={user.id} onClick={() => handleSelectUser(user)} sx={{ cursor: 'pointer' }}>
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                    secondary={`@${user.handle} - Eventos: ${user.events?.map((event) => event.name).join(', ') || 'No events'}`}
                    sx={{
                      '& .MuiListItemText-primary': { color: '#fff' },
                      '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.6)' },
                    }}
                  />
                  <PersonAddIcon sx={{ color: '#fff' }} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No users available" />
              </ListItem>
            )}
          </List>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleTagUser} variant="contained" color="primary">
          Etiquetar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagUserInPicture;
