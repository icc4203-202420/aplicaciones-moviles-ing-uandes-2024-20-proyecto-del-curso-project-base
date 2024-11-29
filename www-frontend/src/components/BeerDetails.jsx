import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, List, ListItem, ListItemText, Divider, Rating, CircularProgress } from '@mui/material';
import api from '../api';
import BeerInfo from './BeerInfo';
import ReviewForm from './ReviewForm';  

function BeerDetails() {
  const [beer, setBeer] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchBeerDetails = async () => {
      try {
        const response = await api.get(`/beers/${id}`);
        setBeer(response.data.beer); 
      } catch (err) {
        console.error('Error fetching beer details:', err);
        setError('Error al cargar los detalles de la cerveza');
      }
    };

    fetchBeerDetails();
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!beer) {
    return (
      <Container>
        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        <Typography>Cargando los detalles de la cerveza...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Card sx={{ mt: 4 }}>
        {beer.image_url && (
          <CardMedia
            component="img"
            height="300"
            image={beer.image_url}
            alt={beer.name}
          />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>{beer.name}</Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>{beer.style}</Typography>
          
          <BeerInfo beer={beer} />

          <Typography variant="h6" gutterBottom>Marca:</Typography>
          <Typography>{beer.brand?.name || 'No disponible'}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Cervecería:</Typography>
          <Typography>{beer.brewery?.name || 'No disponible'}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>Bares que la sirven:</Typography>
          <List>
            {beer.bars && beer.bars.length > 0 ? (
              beer.bars.map(bar => (
                <ListItem key={bar.id}>
                  <ListItemText 
                    primary={bar.name} 
                    secondary={`${bar.address?.line1 || ''}, ${bar.address?.line2 || ''}, ${bar.address?.city || ''}`} 
                  />
                </ListItem>
              ))
            ) : (
              <ListItem><ListItemText primary="No hay información disponible" /></ListItem>
            )}
          </List>
        </CardContent>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Evaluaciones:</Typography>
        <Typography>Rating promedio: {beer.avg_rating ? `${parseFloat(beer.avg_rating).toFixed(1)}/5` : 'No disponible'}</Typography>

        {beer.current_user_review && (
          <Card sx={{ my: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.05)' }}>
            <Typography variant="subtitle1">Tu evaluación:</Typography>
            <Rating value={Number(beer.current_user_review.rating)} readOnly />
            <Typography>{beer.current_user_review.text}</Typography>
          </Card>
        )}

        <List>
          {beer.reviews?.map(review => (
            <ListItem key={review.id}>
              <ListItemText 
                primary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      @{review.user.handle}
                    </Typography>
                    <Rating value={Number(review.rating)} readOnly size="small" />
                  </>
                }
                secondary={review.text}
              />
            </ListItem>
          ))}
        </List>

        {/* Formulario de evaluación */}
        {userId ? (
          <ReviewForm beerId={beer.id} userId={userId} />
        ) : (
          <Typography color="error" variant="h6">
            Debes iniciar sesión para dejar una evaluación.
          </Typography>
        )}
      </Card>
    </Container>
  );
}

export default BeerDetails;
