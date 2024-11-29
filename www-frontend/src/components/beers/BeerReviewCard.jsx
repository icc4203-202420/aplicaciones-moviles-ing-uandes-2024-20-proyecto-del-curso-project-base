import React from 'react';
import { Card, CardContent, Typography, Box, Rating, Avatar } from '@mui/material';

export default function BeerReviewCard({ review }) {
  return (
    <Card sx={{ marginBottom: '16px', boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Avatar sx={{ width: 45, height: 45, marginRight: '10px' }}>
            {review.user.handle.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {'@'}{review.user.handle}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px', marginLeft: '5px' }}>
          <Rating value={parseFloat(review.rating)} readOnly precision={0.5} />
          <Typography variant="body2" sx={{ marginLeft: '4px', marginRight: '2px' }}>
            •
          </Typography>
          <Typography variant="body1" sx={{ marginLeft: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>
            {new Date(review.created_at).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })}
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '10px', marginLeft: '5px' }}>
          {review.text}
        </Typography>
      </CardContent>
    </Card>
  );
}
