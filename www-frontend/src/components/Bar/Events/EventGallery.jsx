import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImageList, ImageListItem, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const EventGallery = ({ eventId }) => {
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    if (!eventId) {
      console.error('Invalid eventId. Cannot fetch pictures.');
      return;
    }

    const fetchPictures = async () => {
      try {
        const response = await axios.get(`/api/v1/events/${eventId}/pictures`);
        setPictures(response.data);
      } catch (error) {
        console.error('Error fetching pictures:', error);
      }
    };

    fetchPictures();
  }, [eventId]);

  return (
    <ImageList cols={3}>
      {pictures.length > 0 ? (
        pictures.map((picture) => (
          <ImageListItem key={picture.id}>
            <img src={picture.image_url} alt={picture.description || 'Event picture'} loading="lazy" />
          </ImageListItem>
        ))
      ) : (
        <Typography>No hay imágenes disponibles para este evento.</Typography>
      )}
    </ImageList>
  );
};

export default EventGallery;
