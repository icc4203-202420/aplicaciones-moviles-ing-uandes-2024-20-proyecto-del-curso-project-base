import axiosInstance from '../api/axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Review from './Review';import { Rating, Typography, Grid2, Box, CircularProgress, Alert, Divider } from '@mui/material';

import './ShowBeer.css'

function ShowBeer({ beersWithBrands }) {
    const { id } = useParams();
    const [beer, setBeer] = useState({});
    const [brand, setBrand] = useState({});
    const [brewery, setBrewery] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        axiosInstance.get(`/beers/${id}`)
            .then((res) => {
                setBeer(res.data.beer);
                setLoading(false);
            })
            .catch((error_beers) => {
                setError('Error loading beer data');
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
      if (beer.brand_id) {
          axiosInstance.get(`/brands/${beer.brand_id}`)
              .then((res) => {
                  setBrand(res.data.brand);
              })
              .catch((error_brands) => {
                  setError('Error loading brand data');
              });
      }
    }, [beer]);

    useEffect(() => {
        if (brand.brewery_id) {
            axiosInstance.get(`/breweries/${brand.brewery_id}`)
                .then((res) => {
                    setBrewery(res.data.brewery);
                })
                .catch((error_breweries) => {
                    setError('Error loading brewery data');
                });
        }
    }, [brand]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    if (error) return <Alert severity="error">{error}</Alert>;

    return (
      <div className="beer-container">
        {/* <div className="app-bar-title">
          {brand.name} - {beer.name}
        </div> */}
        <div className='beer-name'>
          {brand.name} - {beer.name}
        </div>
        <div className="beer-top">
          <div className="beer-img">
            <img src="" alt="img" />
          </div>
          <div className="beer-items">
            
              <Grid2 item='true' xs={6}>
                <Typography variant="body1"><strong>Beer Type:</strong> {beer.beer_type}</Typography>
                <Typography variant="body1"><strong>Style:</strong> {beer.style}</Typography>
                <Typography variant="body1"><strong>Hop:</strong> {beer.hop}</Typography>
                <Typography variant="body1"><strong>Yeast:</strong> {beer.yeast}</Typography>
                <Typography variant="body1"><strong>Malts:</strong> {beer.malts}</Typography>
                <Typography variant="body1"><strong>IBU:</strong> {beer.ibu}</Typography>
                <Typography variant="body1"><strong>Alcohol:</strong> {beer.alcohol}</Typography>
                <Typography variant="body1"><strong>BLG:</strong> {beer.blg}</Typography>
                <Typography variant="body1"><strong>Brewery:</strong> {brewery.name}</Typography>
              </Grid2>
          </div>
        </div>
        <div className="avg-rating">
          <div className="rating-header">
            Average rating:
          </div>
          <Rating className='rating-stars' value={beer.avg_rating} precision={0.5} readOnly />
          <div className="rating-value">
            {beer.avg_rating}
          </div>
        </div>
        <div className="beer-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>


          <Divider sx={{ my: 2 }} />
          <Review beerId={id} />
      </div>
    );
}

export default ShowBeer;
