import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImageList, ImageListItem, Typography, Button, Dialog, DialogContent } from '@mui/material';
import { toast } from 'react-toastify';
import TagUserInPicture from './TagUserInPicture'; // Import TagUserInPicture

const EventGallery = ({ eventId }) => {
  const [pictures, setPictures] = useState([]);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState(null);

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
    </>
  );
};

export default EventGallery;
