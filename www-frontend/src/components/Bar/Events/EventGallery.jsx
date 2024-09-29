import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImageList, ImageListItem, Typography, Button, Dialog, DialogContent } from '@mui/material';
import { Autocomplete, TextField, DialogTitle, DialogActions } from '@mui/material';
import { toast } from 'react-toastify';

const EventGallery = ({ eventId }) => {
  const [pictures, setPictures] = useState([]);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!eventId) {
      console.error('Invalid eventId. Cannot fetch pictures.');
      return;
    }

    const fetchPictures = async () => {
      try {
        const response = await axios.get(`/api/v1/events/${eventId}/pictures`);
        if (response.data && response.data.length > 0) {
          setPictures(response.data);
        } else {
          console.log("No pictures found for this event.");
          setPictures([]);
        }
      } catch (error) {
        console.error('Error fetching pictures:', error);
      }
    };

    fetchPictures();
  }, [eventId]);

  const handleOpenTagDialog = (picture) => {
    setSelectedPicture(picture);
    setTagDialogOpen(true);
  };

  const handleCloseTagDialog = () => {
    setTagDialogOpen(false);
    setSelectedPicture(null);
    setSelectedUser(null);
  };

  const fetchUsers = async (query) => {
    try {
      const response = await axios.get(`/api/v1/users?search=${query}`);
      setUsers(response.data.users || []);
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
      await axios.post(`/api/v1/event_pictures/${selectedPicture.id}/tags`, {
        user_id: selectedUser.id,
      });
      toast.success('Usuario etiquetado con éxito.');
      handleCloseTagDialog();
    } catch (error) {
      console.error('Error al etiquetar al usuario:', error);
      toast.error('No se pudo etiquetar al usuario. Inténtalo de nuevo.');
    }
  };

  return (
    <>
      <ImageList cols={3}>
        {pictures.length > 0 ? (
          pictures.map((picture) => (
            <ImageListItem key={picture.id}>
              <img src={picture.image_url} alt={picture.description || 'Event picture'} loading="lazy" />
              <Button onClick={() => handleOpenTagDialog(picture)} color="primary" variant="outlined" sx={{ mt: 1 }}>
                Etiquetar Usuario
              </Button>
            </ImageListItem>
          ))
        ) : (
          <Typography>No hay imágenes disponibles para este evento.</Typography>
        )}
      </ImageList>

      {/* Diálogo para etiquetar usuario en una imagen */}
      {selectedPicture && tagDialogOpen && (
        <Dialog open={tagDialogOpen} onClose={handleCloseTagDialog}>
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
            <Button onClick={handleCloseTagDialog}>Cancelar</Button>
            <Button onClick={handleTagUser} variant="contained" color="primary">Etiquetar</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default EventGallery;
