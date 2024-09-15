import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Container, Typography, InputAdornment, IconButton, Link as MuiLink } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const fieldsValidation = Yup.object({
  email: Yup.string().email('Invalid email.').required('Email is required.'),
  password: Yup.string().required('Pasword is required'),
});

const initialValues = {
  email: '',
  password: '',
};

function Login() {
  const [showPassword, setShowPassword] = useState(false); 
  const [loginError, setLoginError] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    axios.post('http://localhost:3001/api/v1/login', { user: values })
      .then(response => {
        const JWT_TOKEN = response.headers['authorization'];
        const CURRENT_USER_ID = response.data.status.data.user.id;

        if (CURRENT_USER_ID) {
          localStorage.setItem('CURRENT_USER_ID', CURRENT_USER_ID);
        }
        if (JWT_TOKEN) {
          localStorage.setItem('JWT_TOKEN', JWT_TOKEN);
          toast.success('Succesfully Logged In'); 
          
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        setLoginError('Email or password invalid. Try again.');
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
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#F0DAAE' }}>
          Welcome!
        </Typography>
        <Typography align="center" sx={{ color: '#F0DAAE', mb: 2 }}>
          Create an account to join
        </Typography>

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
                InputProps={{
                  style: { borderColor: '#91480c', color: '#452216' },
                }}
                InputLabelProps={{
                  style: { color: '#452216' },
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
                InputLabelProps={{
                  style: { color: '#452216' },
                }}
              />
              <Box mt={2}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={isSubmitting}
                  variant="contained"
                  sx={{
                    backgroundColor: '#91480c',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#702f07',
                    },
                  }}
                >
                  Log in
                </Button>
              </Box>
            </Form>
          )}
        </Formik>

        {loginError && (
          <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
            {loginError}
          </Typography>
        )}

        <Box mt={2} textAlign="center">
          <Typography variant="body2" sx={{ color: '#452216' }}>
            Don't have an account?{' '}
            <MuiLink href="/signup" sx={{ color: '#F0DAAE' }}>
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
