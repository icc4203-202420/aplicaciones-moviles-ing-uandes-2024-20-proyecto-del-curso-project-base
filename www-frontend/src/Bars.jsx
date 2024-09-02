import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, List, ListItem, ListItemText } from '@mui/material';

const Bars = () => {
  const [bars, setBars] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/v1/bars')
      .then(response => setBars(response.data))
      .catch(error => console.error('Error fetching bars:', error));
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredBars = bars.filter(bar => 
    bar.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <TextField label="Search Bars" variant="outlined" onChange={handleSearch} />
      <List>
        {filteredBars.map(bar => (
          <ListItem key={bar.id}>
            <ListItemText primary={bar.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Bars;
