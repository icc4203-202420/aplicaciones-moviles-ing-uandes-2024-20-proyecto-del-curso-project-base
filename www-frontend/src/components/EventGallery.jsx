import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImageList, ImageListItem } from '@mui/material';

const EventGallery = ({ eventId }) => {
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
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
            <img src={picture.image_url} alt={picture.description} loading="lazy" />
          </ImageListItem>
        ))
      ) : (
        <p>No hay imágenes disponibles para este evento.</p>
      )}
    </ImageList>
  );
};

export default EventGallery;
