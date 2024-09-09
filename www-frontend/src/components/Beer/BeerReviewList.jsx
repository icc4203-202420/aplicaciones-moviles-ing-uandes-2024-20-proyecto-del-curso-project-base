import React from 'react';
import { Card, CardContent, CardHeader, Typography, Divider, Box, Rating } from '@mui/material';

const BeerReviewList = ({ reviews }) => {
    console.log('BeerReviewList reviews:', reviews); // Verifica que reviews se pase correctamente

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Reviews
            </Typography>
            {reviews.length === 0 ? (
                <Typography>No reviews yet.</Typography>
            ) : (
                <Box 
                    sx={{ 
                        maxHeight: '400px',  // Ajusta la altura máxima según sea necesario
                        overflowY: 'auto',   // Habilita el desplazamiento vertical
                        mb: 2                // Añade margen inferior si es necesario
                    }}
                >
                    {reviews.map((review, index) => (
                        <Card key={index} sx={{ marginBottom: 2 }}>
                            <CardHeader
                                title={
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body1">{review.user.handle}</Typography>
                                        <Rating 
                                            value={review.rating} 
                                            readOnly 
                                            precision={0.1} // Ajusta la precisión según sea necesario
                                            sx={{ color: '#FFD700' }} // Color amarillo para las estrellas
                                        />
                                    </Box>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <Typography variant="body2">
                                    {review.text} {/* Texto de la reseña */}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </div>
    );
};

export default BeerReviewList;
