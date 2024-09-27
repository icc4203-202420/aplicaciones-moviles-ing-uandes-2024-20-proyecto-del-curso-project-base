import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';

const FriendSearch = () => {
  const [options, setOptions] = useState([]);

  const handleInputChange = async (event) => {
    try {
      const response = await axios.get(`/api/users?handle=${event.target.value}`);
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.handle}
      renderInput={(params) => <TextField {...params} label="Buscar amigo" onChange={handleInputChange} />}
    />
  );
};

export default FriendSearch;
