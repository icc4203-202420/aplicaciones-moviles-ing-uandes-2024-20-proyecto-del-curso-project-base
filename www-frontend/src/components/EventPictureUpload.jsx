import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Card, CardContent } from '@mui/material';
import fetchAxios from '../Hooks/fetchaxios';

const EventPictureUpload = () => {
  const { barId, eventId } = useParams();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image.');
      return;
    }

    setUploading(true);

    try {
      const response = await fetchAxios.post(
        `/bars/${barId}/events/${eventId}/event_pictures`,
        { image_base64: image } // Base64-encoded image
      );

      if (response.status === 201) {
        alert('Image uploaded successfully!');
        navigate(`/bars/${barId}/events/${eventId}`);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Could not upload the photo. Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Upload Photo</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {image && <img src={image} alt="Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading}
          style={{ marginTop: '10px' }}
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventPictureUpload;
