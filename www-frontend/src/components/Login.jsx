import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Container, Typography, InputAdornment, IconButton, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pintpalLogo from '../assets/pintpal-logo.png';

const fieldsValidation = Yup.object({
  email: Yup.string().email('Email no válido.').required('El email es requerido.'),
  password: Yup.string().required('La contraseña es requerida'),
});

const initialValues = {
  email: '',
  password: '',
};

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    axios.post('http://localhost:3001/api/v1/login', { user: values })
      .then(response => {
        const JWT_TOKEN = response.headers['authorization'];
        const CURRENT_USER_ID = response.data.status.data.user.id;

        if (JWT_TOKEN) {
          localStorage.setItem('JWT_TOKEN', JWT_TOKEN);
        }

        if (CURRENT_USER_ID) {
          localStorage.setItem('CURRENT_USER_ID', CURRENT_USER_ID);
        }

        navigate('/');
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setSnackbarMessage('Error de inicio de sesión. Verifica tus credenciales.');
        setOpenSnackbar(true);
      });
  };
  
  console.log(localStorage.getItem('CURRENT_USER_ID'));
  return (
    <Container maxWidth="xs">
      <Box mt={5}>
        <Typography variant="h4" align="left" gutterBottom sx={{ color: 'black', fontWeight:500 }}>
          Sign In
        </Typography>

        <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom:'20px' }}>
          <img src={pintpalLogo} alt="PintPal Logo" style={{ width: '100px', height: '100px' }} />
          <h2 style={{ margin: 0, color: 'black', fontSize: '2.2rem', fontWeight: 500 }}>PintPal</h2>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={fieldsValidation}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
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
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
                InputProps={{
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
              />
              <Box mt={2} sx={{marginTop:5}}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    background: 'linear-gradient(to right, #FFDB01, #FF8603)',
                    color: 'white',
                    padding: '10px',
                  }}
                >
                  Sign in
                </Button>
              </Box>
              <Box mt={2} textAlign="center">
                <Typography variant="body2" sx={{color: 'grey'}}>
                  Don't have an account?{' '}
                  <Button color="primary" href="/signup" sx={{color:'black', fontSize:14}}>
                    Sign Up
                  </Button>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="error">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
