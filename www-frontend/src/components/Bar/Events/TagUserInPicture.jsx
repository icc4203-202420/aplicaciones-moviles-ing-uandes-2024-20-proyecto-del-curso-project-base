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

  // Obtener todos los amigos del usuario desde el backend al cargar el componente
  const fetchUsers = async () => {
    const token = localStorage.getItem('JWT_TOKEN');
    if (!token) {
      toast.error('Usuario no autenticado. Por favor, inicia sesión.');
      return;
    }

    try {
      const currentUserId = localStorage.getItem('CURRENT_USER_ID');
      const response = await axios.get(`/api/v1/users`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setUsers(response.data.users || []); // Guardamos los usuarios en el estado
      setFilteredUsers(response.data.users || []); // Inicialmente mostramos todos los usuarios
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error);
      toast.error('Error al buscar amigos. Verifica la conexión.');
    }
  };

  // Cargar amigos al inicio
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrar usuarios localmente basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users); // Mostrar todos los usuarios si no hay término de búsqueda
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = users.filter(user =>
        user.first_name.toLowerCase().includes(lowercasedTerm) ||
        user.last_name.toLowerCase().includes(lowercasedTerm) ||
        user.handle.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

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
      setSelectedUsers(selectedUsers.filter(selected => selected.id !== user.id));
    } else {
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
          onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
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
                    backgroundColor: selectedUsers.some(selected => selected.id === user.id) ? '#ddd' : 'transparent',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <AccountCircle />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                    secondary={`@${user.handle} - Eventos: ${user.events?.map(event => event.name).join(', ') || 'No hay eventos'}`}
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
