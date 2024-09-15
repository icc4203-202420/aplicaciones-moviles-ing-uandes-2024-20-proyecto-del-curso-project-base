import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Rating, IconButton, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import BeerReviewForm from './BeerReviewForm'; // Asegúrate de que la ruta sea correcta
import BeerReviewList from './BeerReviewList'; // Asegúrate de que la ruta sea correcta

const CustomStarIcon = styled(StarIcon)(({ theme }) => ({
  color: 'white',
  borderColor: 'white',
  borderWidth: '1px',
}));

const CustomStarBorderIcon = styled(StarBorderIcon)(({ theme }) => ({
  color: 'white',
  borderColor: 'white',
  borderWidth: '1px',
}));

const BeerDetail = () => {
  const { id } = useParams();
  const [beer, setBeer] = useState(null);
  const [openReviewForm, setOpenReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleBackClick = () => {
    window.history.back();
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/beers/${id}`)
      .then(response => {
        console.log('Beer details response:', response.data);
        setBeer(response.data.beer);
        setReviews(response.data.reviews || []); // Obtener reseñas
      })
      .catch(error => {
        console.error('Error fetching beer details:', error);
      });
  }, [id]);

  const handleReviewSubmit = (values) => {
    axios.post(`http://localhost:3001/api/v1/beers/${id}/reviews`, values)
      .then(response => {
        console.log('New review response:', response.data.review);
        setReviews([...reviews, response.data.review]);
      })
      .catch(error => {
        console.error('Error submitting review:', error);
      });
  };

  const handleSuccess = () => {
    console.log('Review successfully submitted!');
    setOpenReviewForm(false);
  };

  if (!beer) return <div>Loading...</div>;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url(/images/IMG_2754.JPG)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        mt: 4, // Margin top
        mb: 10, // Margin bottom
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          height: '100%',
          padding: '20px',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButton 
          onClick={handleBackClick} 
          sx={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            color: 'white',
            fontSize: '1.5rem',
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>

        <div>
          <Typography variant="h4" component="div" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {beer.name}
          </Typography>
          <Typography variant="h6" component="div" color="text.white" gutterBottom sx={{ textAlign: 'center' }}>
            {beer.style}
          </Typography>

          <Box sx={{ marginTop: 2, color: 'white', textAlign: 'center' }}>
            <Typography variant="body1">Brewery: {beer.brewery_name || 'Not Available'}</Typography>
            <Typography variant="body1">Hop: {beer.hop || 'Not Available'}</Typography>
            <Typography variant="body1">Yeast: {beer.yeast || 'Not Available'}</Typography>
            <Typography variant="body1">Malts: {beer.malts || 'Not Available'}</Typography>
            <Typography variant="body1">IBU: {beer.ibu || 'Not Available'}</Typography>
            <Typography variant="body1">Alcohol: {beer.alcohol || 'Not Available'}</Typography>
            <Typography variant="body1">BLG: {beer.blg || 'Not Available'}</Typography>
          </Box>

          <Typography variant="h6" sx={{ marginTop: 2 }}>Bars Serving This Beer:</Typography>
          {beer.bar_names && beer.bar_names.length > 0 ? (
            <ul style={{ padding: 0, listStyle: 'none', color: 'white', textAlign: 'center' }}>
              {beer.bar_names.map((barName, index) => (
                <li key={index} style={{ color: 'white' }}>{barName}</li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2" sx={{ color: 'gray', textAlign: 'center' }}>No bars found.</Typography>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
            <Rating
              value={beer.avg_rating}
              readOnly
              precision={0.5}
              icon={<CustomStarIcon />}
              emptyIcon={<CustomStarBorderIcon />}
              sx={{ color: 'white' }}
            />
            <Typography variant="body2" sx={{ marginTop: '8px', color: 'white' }}>
              {(beer.avg_rating ?? 0).toFixed(1)} ({beer.reviews_count || 'N/A'} Reviews)
            </Typography>
            <Button
              onClick={() => setOpenReviewForm(true)}
              variant="contained"
              sx={{ marginTop: 2, backgroundColor: '#c28744' }}
            >
              Leave a Review
            </Button>
          </Box>
        </div>

        <BeerReviewList reviews={reviews} />

        <BeerReviewForm
          beer={beer}
          open={openReviewForm}
          onClose={() => setOpenReviewForm(false)}
          onSuccess={handleSuccess}
          onSubmit={handleReviewSubmit}
        />
      </Box>
    </Box>
  );
}

export default BeerDetail;
