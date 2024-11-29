import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Bars() {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('/api/v1/bars')
      .then(response => setBars(response.data.bars))
      .catch(error => console.error('Error fetching bars:', error));
  }, []);

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Bares</Typography>
      <TextField
        fullWidth
        label="Buscar bares"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        margin="normal"
      />
      <Grid container spacing={3}>
        {filteredBars.map(bar => (
          <Grid item xs={12} sm={6} md={4} key={bar.id}>
            <Card>
              {bar.image_url && (
                <CardMedia
                  component="img"
                  height="140"
                  image={bar.image_url}
                  alt={bar.name}
                />
              )}
              <CardContent>
                <Typography variant="h5">{bar.name}</Typography>
                <Typography color="textSecondary">{bar.address?.city}</Typography>
                <Button
                    component={Link}
                    to={`/bars/${bar.id}`}  
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    >
                    Ver detalles
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Bars;
