// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Typography,
//   Container,
//   Button,
//   Paper,
//   TextField,
//   List,
//   ListItem,
//   ListItemText
// } from '@mui/material';

// // Función para obtener el ID del usuario actual (ajusta según tu implementación de autenticación)
// const getCurrentUserId = () => {
//   // Aquí se debe obtener el ID del usuario actual basado en la autenticación, por ejemplo:
//   // return auth.currentUser ? auth.currentUser.id : null;
//   // Aquí es un valor de ejemplo
//   return 1; // Cambia esto según tu método de autenticación
// };

// // Función para verificar si el usuario está autenticado
// const isAuthenticated = () => {
//   return Boolean(getCurrentUserId()); // Ajusta esto según tu lógica de autenticación
// };

// function BeerDetail() {
//   const { id } = useParams();
//   const [beer, setBeer] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [userReview, setUserReview] = useState(null);
//   const [newReview, setNewReview] = useState({ text: '', rating: '' });
//   const [avgRating, setAvgRating] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get(`/api/v1/beers/${id}`)
//       .then(response => {
//         setBeer(response.data.beer);
//         setReviews(response.data.reviews);
//         const userId = getCurrentUserId();
//         const userReview = response.data.reviews.find(review => review.user_id === userId);
//         setUserReview(userReview);
//         setAvgRating(response.data.avg_rating);
//       })
//       .catch(error => console.error('Error fetching beer details:', error));
//   }, [id]);

//   const handleSubmitReview = () => {
//     if (!isAuthenticated()) {
//       alert('You must be logged in to write a review.');
//       navigate('/login'); // Redirige a la página de inicio de sesión
//       return;
//     }

//     if (newReview.text.length < 15 || newReview.rating < 1 || newReview.rating > 5) {
//       alert('La evaluación debe tener al menos 15 palabras y un rating entre 1 y 5.');
//       return;
//     }

//     axios.post(`/api/v1/reviews`, {
//       ...newReview,
//       beer_id: id,
//       user_id: getCurrentUserId()
//     })
//       .then(response => {
//         setReviews([...reviews, response.data.review]);
//         setUserReview(response.data.review);
//         setNewReview({ text: '', rating: '' });
//       })
//       .catch(error => console.error('Error submitting review:', error));
//   };

//   return (
//     <Container>
//       {beer && (
//         <>
//           <Typography variant="h4">{beer.name}</Typography>
//           <Typography variant="h6">Brewery: {beer.brewery_name}</Typography>
//           <Typography variant="h6">Average Rating: {avgRating.toFixed(1)}</Typography>
//           <Typography variant="h6">Bars Serving This Beer:</Typography>
//           <List>
//             {beer.bars.map(bar => (
//               <ListItem key={bar.id}>
//                 <ListItemText primary={bar.name} />
//               </ListItem>
//             ))}
//           </List>
//           <Typography variant="h5">User Reviews:</Typography>
//           <List>
//             {reviews.map(review => (
//               <ListItem key={review.id}>
//                 <ListItemText
//                   primary={`Rating: ${review.rating}`}
//                   secondary={review.text}
//                 />
//               </ListItem>
//             ))}
//           </List>
//           {!userReview ? (
//             <Paper style={{ padding: 16 }}>
//               <Typography variant="h6">Write a Review:</Typography>
//               <TextField
//                 label="Review Text"
//                 multiline
//                 rows={4}
//                 fullWidth
//                 value={newReview.text}
//                 onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
//               />
//               <TextField
//                 label="Rating (1-5)"
//                 type="number"
//                 fullWidth
//                 value={newReview.rating}
//                 onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
//               />
//               <Button
//                 variant="contained"
//                 onClick={handleSubmitReview}
//                 style={{ marginTop: 16 }}
//               >
//                 Submit Review
//               </Button>
//             </Paper>
//           ) : (
//             <Typography variant="h6">Your Review: {userReview.text}</Typography>
//           )}
//           <Button variant="contained" component={Link} to={`/beers/${id}`}>
//             See Details
//           </Button>
//         </>
//       )}
//     </Container>
//   );
// }

// export default BeerDetail;
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const BeerDetail = ({ beer }) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {beer.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Style: {beer.style}
                </Typography>
                <Typography variant="body2">
                    <strong>Hop:</strong> {beer.hop}<br />
                    <strong>Yeast:</strong> {beer.yeast}<br />
                    <strong>Malts:</strong> {beer.malts}<br />
                    <strong>IBU:</strong> {beer.ibu}<br />
                    <strong>Alcohol:</strong> {beer.alcohol}<br />
                    <strong>BLG:</strong> {beer.blg}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default BeerDetail;

