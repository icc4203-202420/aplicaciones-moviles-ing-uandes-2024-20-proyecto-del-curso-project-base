import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';

const TagUserInPhoto = ({ pictureId }) => {
  const [options, setOptions] = useState([]);

  const handleInputChange = async (event) => {
    try {
      const response = await axios.get(`/api/users?handle=${event.target.value}`);
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleTagUser = async (userId) => {
    try {
      await axios.post(`/api/event_pictures/${pictureId}/tag`, { user_id: userId });
      alert('Usuario etiquetado con éxito.');
    } catch (error) {
      alert('Error al etiquetar el usuario.');
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.handle}
      onChange={(event, newValue) => handleTagUser(newValue.id)}
      renderInput={(params) => <TextField {...params} label="Etiquetar amigo" onChange={handleInputChange} />}
    />
  );
};

export default TagUserInPhoto;
