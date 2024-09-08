import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';

// esto ojala hubiera sido un solo componente (junto a BarsList),
// pero lo hare para la proxima lo juro!!

function BeersList({searchKeywords}) {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:3001/api/v1/beers')
      .then(response => {
        setBeers(response.data.beers);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const filteredBeers = beers.filter(beer => 
    beer.name.toLowerCase().includes(searchKeywords.toLowerCase())
  );

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load beers.</Typography>;

  return (
    <Box>
      {filteredBeers.map(beer => (
        <Typography key={beer.id} variant="h6">
          {beer.name}
        </Typography>
      ))}
    </Box>
  );
}

export default BeersList;
