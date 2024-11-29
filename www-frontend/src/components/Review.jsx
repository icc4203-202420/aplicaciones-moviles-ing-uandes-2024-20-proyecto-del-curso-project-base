import { useParams } from "react-router-dom";
import { useReducer, useEffect } from "react";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axiosInstance from "../api/axios";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const validationSchema = yup.object({
  rating: yup.number().min(1).max(5).required('Rating is required'),
  text: yup.string()
    .test('minWords', 'Review must have at least 15 words', function (value) {
      const words = value ? value.trim().split(/\s+/) : [];
      return words.length >= 15;
    })
    .required('Review is required')
});

function ReviewForm({ beerId }) {
  const { id } = useParams();
  const user_id = JSON.parse(localStorage.getItem('Tapp/Session/currentUser')).id;

  const reviewsReducer = (state, action) => {
    switch (action.type) {
      case 'LOADING_REVIEW':
        return { ...state, loading: true, error: '', reviews: [] };
      case 'SHOW_REVIEW':
        return { ...state, loading: false, reviews: action.payload };
      case 'ADD_REVIEW':
        return { ...state, reviews: [action.payload, ...state.reviews] };
      case 'ERROR_REVIEW':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reviewsReducer, {
    reviews: [],
    loading: false,
    error: ''
  });

  const apiUrl = `http://localhost:3001/api/v1/beers/${id}/reviews`;

  useEffect(() => {
    const fetchReviews = async () => {
      dispatch({ type: 'LOADING_REVIEW' });

      try {
        const response = await axiosInstance.get(apiUrl);
        let reviews = response.data.reviews;
        const userReview = reviews.find(review => review.user_id === user_id);
        if (userReview) {
          reviews = [userReview, ...reviews.filter(review => review.user_id !== user_id)];
        }

        dispatch({ type: 'SHOW_REVIEW', payload: reviews });
      } catch (error) {
        dispatch({ type: 'ERROR_REVIEW', payload: 'Error loading reviews' });
      }
    };

    fetchReviews();
  }, [apiUrl, user_id]);

  if (state.loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (state.error) return <Alert severity="error">{state.error}</Alert>;

  return (
    <>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Submit Your Review</Typography>
        <Formik
          initialValues={{ rating: 3, text: '', beer_id: id, user_id: user_id }}
          validationSchema={validationSchema}
          onSubmit={(values, { validateForm }) => {
            validateForm().then(errors => {
              if (Object.keys(errors).length) {
                alert("Please fill out all required fields");
              } else {
                axiosInstance.post(`/beers/${id}/reviews`, { 'review': values })
                  .then((res) => {
                    dispatch({ type: 'ADD_REVIEW', payload: res.data.review });
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            });
          }}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <div>
                <Typography gutterBottom>Rating:</Typography>
                <Box sx={{ width: 200 }}>
                  <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
                    <Slider
                      aria-label="Rating"
                      step={0.1}
                      value={values.rating}
                      min={1}
                      max={5}
                      valueLabelDisplay="on"
                      onChange={(event, newValue) => setFieldValue('rating', newValue)}
                    />
                  </Stack>
                </Box>
                <ErrorMessage name="rating" component="div" style={{ color: 'red' }} />
              </div>

              <div>
                <TextField
                  fullWidth
                  id="text"
                  name="text"
                  label="Your Review"
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="normal"
                  onChange={(e) => setFieldValue('text', e.target.value)}
                />
                <ErrorMessage name="text" component="div" style={{ color: 'red' }} />
              </div>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Card>

      <ReviewList reviews={state.reviews} />
    </>
  );
}

function ReviewList({ reviews }) {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Reviews</Typography>
      <List>
        {reviews.map((review) => (
          <ListItem key={review.id} sx={{ mb: 1 }}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant="h6">Rating: {review.rating}</Typography>
                <Typography variant="body1">{review.text}</Typography>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

function Review() {
  return (
    <>
      <Typography variant="h3" align="center" gutterBottom>Beer Reviews</Typography>
      <ReviewForm />
    </>
  );
}

export default Review;
