import React, { useState } from 'react';
import { Button, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

function UploadPhoto({ eventId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('event_picture[image]', selectedFile);
    formData.append('event_picture[description]', description);

    setLoading(true);
    try {
      const response = await axios.post(`/api/v1/events/${eventId}/event_pictures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TextField
        type="file"
        onChange={handleFileChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={handleDescriptionChange}
        fullWidth
        margin="normal"
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <Button variant="contained" color="primary" onClick={handleUpload}>
          Upload Photo
        </Button>
      )}
    </div>
  );
}

export default UploadPhoto;
