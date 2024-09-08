import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import useAxios from 'axios-hooks';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Configura Axios con la URL base de la API
axios.defaults.baseURL = 'http://localhost:3001/api/v1'; // Cambia esta URL a la de tu backend

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const initialValues = {
  email: '',
  password: '',
};

const Login = ({ tokenHandler }) => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const [{ loading }, executePost] = useAxios(
    {
      url: '/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' } // Cambiamos a JSON
    },
    { manual: true }
  );

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await executePost({ data: JSON.stringify(values) });
      const receivedToken = response.data.token;

      if (receivedToken) {
        tokenHandler(receivedToken);
      }

      setServerError('');
      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setServerError('Incorrect email or password.');
      } else if (err.response) {
        setServerError(`Server error: ${err.response.status}. ${err.response.data.message || 'Please try again later.'}`);
      } else {
        setServerError('An unknown error occurred. Please try again later.');
      }
      console.error('Error during form submission:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Log In
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form style={{ width: '100%' }}>
              <Box sx={{ mt: 2 }}>
                <Field
                  as={TextField}
                  fullWidth
                  variant="outlined"
                  label="Email"
                  name="email"
                  type="email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  margin="normal"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Field
                  as={TextField}
                  fullWidth
                  variant="outlined"
                  label="Password"
                  name="password"
                  type="password"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                />
              </Box>
              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Submitting...' : 'Log In'}
                </Button>
              </Box>
              {serverError && (
                <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
                  {serverError}
                </Typography>
              )}
            </Form>
          )}
        </Formik>
        <Box sx={{ mt: 2 }}>
          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
