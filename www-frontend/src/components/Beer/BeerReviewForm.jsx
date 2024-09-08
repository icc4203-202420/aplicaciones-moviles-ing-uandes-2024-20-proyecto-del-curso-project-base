import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const BeerReviewForm = ({ onSubmit }) => {
    const [rating, setRating] = useState(1);
    const [review, setReview] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (review.split(' ').length < 15) {
            alert('Review must be at least 15 words.');
            return;
        }
        onSubmit({ rating, review });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Typography variant="h6">Submit Your Review</Typography>
            <TextField
                label="Rating (1-5)"
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                inputProps={{ min: 1, max: 5 }}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Review"
                multiline
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <Button type="submit" variant="contained" color="primary">Submit Review</Button>
        </Box>
    );
};

export default BeerReviewForm;
