import React, { useState } from 'react';
import axios from 'axios';

const UploadEventPicture = ({ eventId, userId }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('event_picture[image]', selectedFile);
      formData.append('event_picture[event_id]', eventId);
      formData.append('event_picture[user_id]', userId);

      try {
        await axios.post('/api/event_pictures', formData);
        alert('Foto subida con éxito.');
      } catch (error) {
        alert('Error al subir la foto.');
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" capture="camera" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir Foto</button>
    </div>
  );
};

export default UploadEventPicture;
