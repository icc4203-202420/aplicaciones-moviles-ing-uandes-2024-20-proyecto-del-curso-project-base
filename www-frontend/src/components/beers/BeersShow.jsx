import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Dialog, Button, Snackbar, Alert, CircularProgress, Pagination, Divider } from '@mui/material'; // Import Divider
import beersHomeImage from './assets/home.png'; 
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchBar from '../SearchBar';
import BeerReviewForm from "./BeerReviewForm";
import BeerReviewCard from './BeerReviewCard';

function userReviewsFirst(reviews, currentUserId) {
    const userReviews = reviews.filter(review => review.user_id === parseInt(currentUserId));
    const otherReviews = reviews.filter(review => review.user_id !== parseInt(currentUserId));
    return [...userReviews, ...otherReviews];
}

// Para el useReducer()
const initialState = {
    reviews: [],
    loading: true,
    error: null,
    page: 1,
    totalPages: 1
};

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REVIEWS_SUCCESS':
            const orderedReviews = userReviewsFirst(action.payload.reviews, action.payload.currentUserId);
            return {
                ...state,
                reviews: orderedReviews,
                loading: false,
                totalPages: action.payload.totalPages
            };
        case 'FETCH_REVIEWS_ERROR':
            return {
                ...state,
                loading: false,
                error: action.error
            };
        case 'SET_PAGE':
            return {
                ...state,
                page: action.page
            };
        default:
            return state;
    }
}

export default function BeersShow() {
    const { id } = useParams();
    const [beer, setBeer] = React.useState(null);
    const [state, dispatch] = useReducer(reducer, initialState);
    const [openReviewForm, setOpenReviewForm] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const handleBackClick = () => {
        window.history.back();
    };

    const handleReviewSubmit = (values) => {
        const review = {
            text: values.text,
            rating: values.rating,
            beer_id: beer.id,
        };

        const userId = localStorage.getItem('CURRENT_USER_ID');

        axios.post(`http://localhost:3001/api/v1/reviews`, { review, user_id: userId })
            .then(() => {
                setSnackbarMessage("Review submitted successfully");
                setOpenSnackbar(true);
                fetchReviews(state.page); 
            })
            .catch(error => {
                setSnackbarMessage("Failed to submit review");
                setOpenSnackbar(true);
            });
    };

    const fetchReviews = (page) => {
        dispatch({ type: 'FETCH_REVIEWS_ERROR', error: null });
        dispatch({ type: 'SET_PAGE', page });

        axios.get(`http://localhost:3001/api/v1/beers/${id}/reviews?page=${page}`)
            .then(response => {
                const currentUserId = localStorage.getItem('CURRENT_USER_ID');
                dispatch({ 
                    type: 'FETCH_REVIEWS_SUCCESS',
                    payload: { 
                        reviews: response.data.reviews, 
                        totalPages: response.data.total_pages,
                        currentUserId: currentUserId 
                    }
                });
            })
            .catch(error => {
                dispatch({ type: 'FETCH_REVIEWS_ERROR', error: error.message });
            });
    };

    useEffect(() => {
        axios.get(`http://localhost:3001/api/v1/beers/${id}`)
            .then(response => {
                setBeer(response.data.beer);
                fetchReviews(state.page);
            });
    }, [id, state.page]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSnackbarMessage("");
        }, 3000);
        return () => clearTimeout(timeout);
    }, [snackbarMessage]);

    if (!beer) return <div>Loading...</div>;

    return (
        <>        
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
                <IconButton onClick={handleBackClick}>
                    <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem' }} />
                </IconButton>
                <SearchBar value={beer.name} />
            </div>

            <Card sx={{ maxWidth: 600, margin: 'auto', marginTop: '20px', boxShadow: 5}}>
                <CardMedia
                    component="img"
                    height="140"
                    image={beersHomeImage}
                />
                <CardContent>
                    
                    <Typography variant="h5" component="div" gutterBottom>
                        {beer.name} ({beer.style})
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        <strong>Alcohol:</strong> {beer.alcohol}%<br />
                        <strong>Bitterness (IBU):</strong> {beer.ibu}<br />
                        <br />
                        <strong>Produced by:</strong>
                        {' '} {beer.brewery_name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        <Rating value={beer.avg_rating} readOnly precision={0.5} />
                        <Typography variant="body2" sx={{ marginLeft: '8px' }}>
                            {parseFloat(beer.avg_rating).toFixed(2)}
                        </Typography>
                    </Box>
                    
                    <Typography variant="body1" sx={{marginTop:2}}>
                        You can find it at:
                        {beer.bar_names && beer.bar_names.length > 0 ? (
                            <ul>
                                {beer.bar_names.map((barName, index) => (
                                    <li key={index}>{barName}</li>
                                ))}
                            </ul>
                        ) : (
                            <span style={{color:'gray', fontSize:'16px'}}>No bars found.</span>
                        )}
                    </Typography>
                </CardContent>
                <Box sx={{ maxWidth: 600, margin: 'auto'}}>        
                    <Divider sx={{ marginTop: '10px', marginBottom: '15px', marginX: '20px' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <Typography variant="h6" sx={{  marginLeft: '10px', fontWeight: 'bold' }}>Reviews</Typography>
                        <Button onClick={() => setOpenReviewForm(true)} color="primary" sx={{ fontSize: '0.8rem', marginRight: '10px' }}>
                            Write a Review
                        </Button>
                    </Box>

                    {state.loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <CircularProgress />
                        </Box>
                        
                    ) : state.error ? (
                        <Typography variant="body2" color="error">
                            Error loading reviews: {state.error}
                        </Typography>
                    
                ) : state.reviews.length > 0 ? (
                        <>
                            {state.reviews.map(review => (
                                <BeerReviewCard key={review.user.id} review={review} />
                            ))}
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Pagination
                                    count={state.totalPages}
                                    page={state.page}
                                    onChange={(value) => fetchReviews(value)}
                                    color="primary"
                                />
                            </Box>
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '40px' }}>
                            No reviews found.
                        </Typography>
                    )}
                </Box>
            </Card>

            <Dialog open={openReviewForm} onClose={() => setOpenReviewForm(false)}>
                <BeerReviewForm
                    beer={beer}
                    open={openReviewForm}
                    onClose={() => setOpenReviewForm(false)}
                    onSubmit={handleReviewSubmit}
                />
            </Dialog>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarMessage.includes('Failed') ? 'error' : 'success'}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
        </>
    );
}
