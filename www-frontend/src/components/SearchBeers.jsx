import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Beers() {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/v1/beers')
      .then(response => setBeers(response.data.beers))
      .catch(error => console.error('Error fetching beers:', error));
  }, []);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Beers</Typography>
      <TextField
        fullWidth
        label="Search beers"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />
      <Grid container spacing={3}>
        {filteredBeers.map(beer => (
          <Grid item xs={12} sm={6} md={4} key={beer.id}>
            <Card>
              {beer.image_url && (
                <CardMedia
                  component="img"
                  height="140"
                  image={beer.image_url}
                  alt={beer.name}
                />
              )}
              <CardContent>
                <Typography variant="h5">{beer.name}</Typography>
                <Typography color="textSecondary">{beer.style}</Typography>
                <Button 
                  component={Link} 
                  to={`/beers/${beer.id}`} 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Ver más
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Beers;