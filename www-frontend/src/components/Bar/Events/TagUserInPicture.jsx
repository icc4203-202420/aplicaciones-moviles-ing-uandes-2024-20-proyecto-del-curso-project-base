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
  const [selectedUsers, setSelectedUsers] = useState([]); // Lista de usuarios etiquetados
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar amigos del usuario desde el backend
  const fetchUsers = async (query = '') => {
    const token = localStorage.getItem('JWT_TOKEN');
    if (!token) {
      toast.error('Usuario no autenticado. Por favor, inicia sesión.');
      return;
    }

    try {
      const currentUserId = localStorage.getItem('CURRENT_USER_ID'); // Obtener el ID del usuario actual
      const response = await axios.get(`/api/v1/users?search=${query}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setUsers(response.data.users || []);
      setFilteredUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error);
      toast.error('Error al buscar amigos. Verifica la conexión.');
    }
  };

  // Cargar amigos al inicio
  useEffect(() => {
    fetchUsers();
  }, []);

  // Manejar la etiqueta de usuario
  const handleTagUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Por favor, selecciona al menos un usuario para etiquetar.');
      return;
    }

    const token = localStorage.getItem('JWT_TOKEN');
    if (!token) {
      toast.error('Usuario no autenticado. Por favor, inicia sesión.');
      return;
    }

    try {
      // Enviar todos los user_ids en la solicitud POST
      await Promise.all(
        selectedUsers.map(user =>
          axios.post(
            `/api/v1/events/${eventId}/event_pictures/${pictureId}/tag_user`,
            { user_id: user.id },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          )
        )
      );
      toast.success('Usuarios etiquetados con éxito.');
      onClose();
    } catch (error) {
      console.error('Error al etiquetar usuarios:', error);
      toast.error('No se pudieron etiquetar los usuarios. Inténtalo de nuevo.');
    }
  };

  // Manejar la selección de un usuario
  const handleSelectUser = (user) => {
    if (selectedUsers.some(selected => selected.id === user.id)) {
      // Si el usuario ya está etiquetado, lo quitamos de la lista
      setSelectedUsers(selectedUsers.filter(selected => selected.id !== user.id));
    } else {
      // Si no está etiquetado, lo añadimos a la lista
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Etiquetar usuarios en la imagen</DialogTitle>
      <DialogContent>
        <TextField
          label="Buscar amigo"
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
                <ListItem
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedUsers.some(selected => selected.id === user.id) ? '#ddd' : 'transparent', // Resaltar si está seleccionado
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                    secondary={`@${user.handle} - Eventos: ${user.events?.map((event) => event.name).join(', ') || 'No hay eventos'}`}
                    sx={{
                      '& .MuiListItemText-primary': { color: '#fff' },
                      '& .MuiListItemText-secondary': { color: 'rgba(255, 255, 255, 0.6)' },
                    }}
                  />
                  <PersonAddIcon sx={{ color: selectedUsers.some(selected => selected.id === user.id) ? 'green' : '#fff' }} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No hay amigos disponibles" />
              </ListItem>
            )}
          </List>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleTagUsers} variant="contained" color="primary">
          Etiquetar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagUserInPicture;
