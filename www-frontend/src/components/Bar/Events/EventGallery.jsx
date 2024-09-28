import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ImageList, ImageListItem } from '@mui/material';
import { useParams } from 'react-router-dom';

const EventGallery = () => {
  const { eventId } = useParams(); // Obtiene eventId de los parámetros de la URL
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const fetchPictures = async () => {
      if (!eventId) {
        console.error('Error: eventId is undefined');
        return;
      }

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
