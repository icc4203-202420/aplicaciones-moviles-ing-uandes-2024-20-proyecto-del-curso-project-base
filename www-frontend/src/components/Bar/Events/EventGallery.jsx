import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImageList, ImageListItem, Typography, Button, Dialog, DialogContent } from '@mui/material';
import { toast } from 'react-toastify';
import TagUserInPicture from './TagUserInPicture';
import { Person as PersonIcon } from '@mui/icons-material'; // Asegúrate de importar el ícono

const EventGallery = ({ eventId }) => {
  const [pictures, setPictures] = useState([]);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [taggedUsersDialogOpen, setTaggedUsersDialogOpen] = useState(false);

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
  };

  const fetchTaggedUsers = async (pictureId) => {
    try {
      // Recupera el token de autorización del localStorage
      const token = localStorage.getItem('JWT_TOKEN'); // Cambia 'token' al nombre que estás usando para almacenar el token
  
      const response = await axios.get(`/api/v1/events/${eventId}/event_pictures/${pictureId}/tagged_users`, {
        headers: {
          Authorization: `${token}`
        }
      });
  
      setTaggedUsers(response.data);
      setTaggedUsersDialogOpen(true);
    } catch (error) {
      console.error('Error fetching tagged users:', error);
    }
  };
  
  
  const handleCloseTaggedUsersDialog = () => {
    setTaggedUsersDialogOpen(false);
    setTaggedUsers([]);
  };

  return (
    <>
      <ImageList cols={3}>
        {pictures.length > 0 ? (
          pictures.map((picture) => (
            <ImageListItem key={picture.id}>
              <img
                src={picture.image_url}
                alt={picture.description || 'Event picture'}
                loading="lazy"
              />
              <Button
                onClick={() => handleOpenTagDialog(picture)}
                color="primary"
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Etiquetar Usuario
              </Button>
              <Button
                onClick={() => fetchTaggedUsers(picture.id)}
                color="secondary"
                variant="outlined"
                sx={{ mt: 1, ml: 1 }}
              >
                Tagged Users
              </Button>
            </ImageListItem>
          ))
        ) : (
          <Typography>No hay imágenes disponibles para este evento.</Typography>
        )}
      </ImageList>

      {/* Tag User Dialog */}
      {selectedPicture && (
        <TagUserInPicture
          eventId={eventId}
          pictureId={selectedPicture.id}
          onClose={handleCloseTagDialog}
        />
      )}

      {/* Tagged Users Dialog */}
      <Dialog open={taggedUsersDialogOpen} onClose={handleCloseTaggedUsersDialog}>
        <DialogContent>
          <Typography variant="h6">Usuarios Etiquetados</Typography>
          {taggedUsers.length > 0 ? (
            taggedUsers.map((user) => (
              <Typography key={user.id} display="flex" alignItems="center" sx={{ mt: 1 }}>
                <PersonIcon sx={{ mr: 1 }} /> {/* Ícono de usuario */}
                {user.handle} {/* Suponiendo que el modelo User tiene un atributo 'username' */}
              </Typography>
            ))
          ) : (
            <Typography>No hay usuarios etiquetados.</Typography>
          )}
        </DialogContent>
      </Dialog>

    </>
  );
};

export default EventGallery;
