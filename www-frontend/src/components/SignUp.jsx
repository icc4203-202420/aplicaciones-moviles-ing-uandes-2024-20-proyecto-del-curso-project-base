import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Container, Typography, InputAdornment, IconButton, Link as MuiLink, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  first_name: Yup.string().required('First Name is required'),
  last_name: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid Email').required('Email is required'),
  handle: Yup.string().required('Handle is required').min(3, 'Handle must have at least 3 characters'),
  password: Yup.string().required('Password is required').min(6, 'Password must have at least 6 characters'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'The passwords must match')
    .required('Required'),
});

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  handle: '',
  password: '',
  password_confirmation: '',
};

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    setServerError('');
    axios.post('http://localhost:3001/api/v1/signup', { user: values })
      .then((response) => {
        const JWT_TOKEN = response.headers['authorization'];
        console.log('User registered successfully:', response.data);
   
        if (JWT_TOKEN) {
          localStorage.setItem('JWT_TOKEN', JWT_TOKEN);
        }
        navigate('/login');
      })
      .catch((error) => {
        setSubmitting(false);
        if (error.response && error.response.data && error.response.data.status && error.response.data.status.message) {
          setServerError(error.response.data.status.message);
        } else {
          setServerError('An error occurred. Please try again later.');
        }
      });
  };

  return (
    <Container maxWidth="xs" sx={{
      backgroundImage: 'url(/images/IMG_2757.JPG)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box mt={5} sx={{ backgroundColor: '#CB9650', padding: 4, borderRadius: 2 }}>
        <Typography variant="h4" align='center' gutterBottom sx={{ color: '#F0DAAE' }}>
          Welcome!
        </Typography>
        <Typography align="center" sx={{ color: '#F0DAAE', mb: 2 }}>
          Create an account to join
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                name="first_name"
                label="First name"
                fullWidth
                margin="normal"
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
                InputProps={{ style: { borderColor: '#91480c', color: '#452216' }}}
                InputLabelProps={{ style: { color: '#452216' }}}
              />
              <Field
                as={TextField}
                name="last_name"
                label="Last name"
                fullWidth
                margin="normal"
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
                InputProps={{ style: { borderColor: '#91480c', color: '#452216' }}}
                InputLabelProps={{ style: { color: '#452216' }}}
              />
              <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                InputProps={{ style: { borderColor: '#91480c', color: '#452216' }}}
                InputLabelProps={{ style: { color: '#452216' }}}
              />
              <Field
                as={TextField}
                name="handle"
                label="Handle"
                fullWidth
                margin="normal"
                error={touched.handle && Boolean(errors.handle)}
                helperText={touched.handle && errors.handle}
                InputProps={{ style: { borderColor: '#91480c', color: '#452216' }}}
                InputLabelProps={{ style: { color: '#452216' }}}
              />
              <Field
                as={TextField}
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  style: { borderColor: '#91480c', color: '#452216' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { color: '#452216' }}}
              />
              <Field
                as={TextField}
                name="password_confirmation"
                label="Confirm Password"
                type={showPasswordConfirmation ? 'text' : 'password'}
                fullWidth
                margin="normal"
                error={touched.password_confirmation && Boolean(errors.password_confirmation)}
                helperText={touched.password_confirmation && errors.password_confirmation}
                InputProps={{
                  style: { borderColor: '#91480c', color: '#452216' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        edge="end"
                      >
                        {showPasswordConfirmation ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ style: { color: '#452216' }}}
              />
              <Box mt={3}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: '#91480c',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#702f07',
                    },
                  }}
                  disabled={isSubmitting}
                >
                  Sign Up
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}