import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, List, ListItem, ListItemText } from '@mui/material';

const Beers = () => {
  const [beers, setBeers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/v1/beers')
      .then(response => setBeers(response.data))
      .catch(error => console.error('Error fetching beers:', error));
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredBeers = beers.filter(beer => 
    beer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <TextField label="Search Beers" variant="outlined" onChange={handleSearch} />
      <List>
        {filteredBeers.map(beer => (
          <ListItem key={beer.id}>
            <ListItemText primary={beer.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Beers;
