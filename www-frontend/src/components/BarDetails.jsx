import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, Card, CardContent, CardMedia, Divider, Button } from '@mui/material';
import axios from 'axios';

function BarDetails() {
  const { id } = useParams();  // Obtener el ID del bar desde la URL
  const [bar, setBar] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/api/v1/bars/${id}`)
      .then(response => setBar(response.data))
      .catch(error => setError('Error fetching bar details'));
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!bar) {
    return <Typography>Cargando detalles del bar...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4">{bar.name}</Typography>
      <Typography color="textSecondary">{bar.address?.city}</Typography>

      {bar.image_url && (
        <CardMedia
          component="img"
          height="200"
          image={bar.image_url}
          alt={bar.name}
        />
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h5">Cervezas Disponibles</Typography>
      <List>
        {bar.beers.length > 0 ? (
          bar.beers.map(beer => (
            <ListItem key={beer.id}>
              <ListItemText primary={beer.name} secondary={beer.style} />
              <Button 
                  component={Link} 
                  to={`/beers/${beer.id}`} 
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Detalles
                </Button>
            </ListItem>
          ))
        ) : (
          <Typography>No hay cervezas disponibles en este bar.</Typography>
        )}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h5">Próximos Eventos</Typography>
      <List>
        {bar.events.length > 0 ? (
          bar.events.map(event => (
            <Card key={event.id} sx={{ my: 2 }}>
              <CardContent>
                <Typography variant="h6">{event.name}</Typography>
                <Typography>{new Date(event.date).toLocaleDateString()} - {new Date(event.date).toLocaleTimeString()}</Typography>
                <Typography variant="body2">{event.description}</Typography>

                {/* Botón para ver los detalles del evento */}
                <Button
                    component={Link}
                    to={`/events/${event.id}`}  
                    key={event.id}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    >
                    Mas info
                </Button>

              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No hay eventos próximos en este bar.</Typography>
        )}
      </List>
    </Container>
  );
}

export default BarDetails;
