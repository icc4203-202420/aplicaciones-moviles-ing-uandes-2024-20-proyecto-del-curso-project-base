import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const BeerPopup = ({ open, onClose, beer }) => {
  const [beerDetails, setBeerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (beer) {
      axios.get(`http://localhost:3001/api/v1/beers/${beer.id}`)
        .then(response => {
          setBeerDetails(response.data.beer);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching beer details:', error);
          setError('Failed to load beer details');
          setLoading(false);
        });
    }
  }, [beer]);

  const handleSeeDetailsClick = () => {
    if (beerDetails) {
      window.location.href = `/beers/${beerDetails.id}`;
    }
    onClose();
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!beerDetails) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth sx={{ '& .MuiDialog-paper': { bgcolor: '#D6A96D' }}}>
      <DialogTitle sx={{ color: '#452216' }}>
        {beerDetails.name}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 8, top: 8, color: '#452216' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ color: '#452216' }}>
        <Typography variant="h6">Brewery: {beerDetails.brewery_name || 'Not Available'}</Typography>
        <Typography variant="body1">Style: {beerDetails.style}</Typography>
        <Typography variant="body1">Hop: {beerDetails.hop}</Typography>
        <Typography variant="body1">Yeast: {beerDetails.yeast}</Typography>
        <Typography variant="body1">Malts: {beerDetails.malts}</Typography>
        <Typography variant="body1">IBU: {beerDetails.ibu}</Typography>
        <Typography variant="body1">Alcohol: {beerDetails.alcohol}</Typography>
        <Typography variant="body1">BLG: {beerDetails.blg}</Typography>
        <Typography variant="body1">Average Rating: {beerDetails.avg_rating || 'Not Rated'}</Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>Bars Serving This Beer:</Typography>
        {beerDetails.bar_names && beerDetails.bar_names.length > 0 ? (
          <List>
            {beerDetails.bar_names.map((bar, index) => (
              <ListItem key={index}>
                <ListItemText primary={bar} sx={{ color: '#452216' }} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>No bars available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSeeDetailsClick} color="primary" sx={{ color: '#452216' }}>See Details</Button>
        <Button onClick={onClose} color="secondary" sx={{ color: '#452216' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BeerPopup;