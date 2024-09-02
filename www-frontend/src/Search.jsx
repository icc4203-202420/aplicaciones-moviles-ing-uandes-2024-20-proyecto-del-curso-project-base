import React, { useState } from 'react';
import { Container, TextField, Button } from '@mui/material';

const SearchUser = () => {
  const [handle, setHandle] = useState('');

  const handleSearch = () => {
    console.log(`Searching for user: ${handle}`);
  };

  return (
    <Container>
      <TextField 
        label="Search User by Handle" 
        variant="outlined" 
        onChange={(e) => setHandle(e.target.value)} 
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>
    </Container>
  );
};

export default SearchUser;
