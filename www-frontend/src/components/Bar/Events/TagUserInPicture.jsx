import React, { useState } from 'react';
import axios from 'axios';
import { Autocomplete, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { toast } from 'react-toastify';

const TagUserInPicture = ({ eventId, pictureId, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async (query) => {
    try {
      const response = await axios.get(`/api/v1/users?search=${query}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleTagUser = async () => {
    if (!selectedUser) {
      toast.error('Por favor, selecciona un usuario para etiquetar.');
      return;
    }

    try {
      await axios.post(`/api/v1/event_pictures/${pictureId}/tags`, {
        user_id: selectedUser.id,
      });
      toast.success('Usuario etiquetado con éxito.');
      onClose();
    } catch (error) {
      console.error('Error al etiquetar al usuario:', error);
      toast.error('No se pudo etiquetar al usuario. Inténtalo de nuevo.');
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Etiquetar usuario en la imagen</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={users}
          getOptionLabel={(option) => `${option.first_name} ${option.last_name} (@${option.handle})`}
          onInputChange={(event, value) => fetchUsers(value)}
          onChange={(event, newValue) => setSelectedUser(newValue)}
          renderInput={(params) => <TextField {...params} label="Buscar usuario" />}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleTagUser} variant="contained" color="primary">Etiquetar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagUserInPicture;
