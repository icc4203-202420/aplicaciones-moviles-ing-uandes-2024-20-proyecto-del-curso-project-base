import { useState } from 'react';
import { Container, TextField, Button, Typography, Slider } from '@mui/material';
import api from '../api';

function ReviewForm({ beerId, userId, onReviewSubmitted }) {
  const [rating, setRating] = useState(3);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    // Validación para asegurarse que el texto tenga al menos 15 palabras
    if (text.split(/\s+/).length < 15) {
      setError('La evaluación debe tener al menos 15 palabras.');
      return;
    }

    try {
      const token = localStorage.getItem('token');  // Token JWT almacenado
      if (!token) {
        console.error("No token found in localStorage");
        return;  // Si no hay token, no intentes hacer la solicitud
      }

      const response = await api.post(`/reviews`, {
        review: {
          rating,
          text,
          beer_id: beerId,
          user_id: userId  
        }
      }, {
        headers: {
          Authorization: `Bearer ${token}`  // Autenticación con JWT
        }
      });

      setSuccess(true);
      setText('');
      setRating(3);

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

    } catch (err) {
      console.error('Error creating review:', err);
      setError('Hubo un error al crear la evaluación.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h6">Escribe una evaluación</Typography>
      <form onSubmit={handleSubmit}>
        <Typography gutterBottom>Rating:</Typography>
        <Slider
          value={rating}
          onChange={handleRatingChange}
          step={0.1}
          marks
          min={1}
          max={5}
          valueLabelDisplay="auto"
        />
        
        <TextField
          label="Escribe tu evaluación"
          multiline
          rows={4}
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ my: 2 }}
          error={Boolean(error)}
          helperText={error || 'La evaluación debe tener al menos 15 palabras.'}
        />

        {success && <Typography color="success.main">Evaluación enviada con éxito.</Typography>}
        
        <Button type="submit" variant="contained" color="primary">
          Enviar Evaluación
        </Button>
      </form>
    </Container>
  );
}

export default ReviewForm;
