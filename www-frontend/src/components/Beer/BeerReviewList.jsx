import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const BeerReviewList = ({ reviews }) => {
    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Reviews
            </Typography>
            {reviews.length === 0 ? (
                <Typography>No reviews yet.</Typography>
            ) : (
                <List>
                    {reviews.map((review, index) => (
                        <ListItem key={index}>
                            <ListItemText
                                primary={`Rating: ${review.rating}`}
                                secondary={review.review}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
};

export default BeerReviewList;
