import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const fieldsValidation = Yup.object({
  first_name: Yup.string().required('El nombre es requerido.'),
  last_name: Yup.string().required('El apellido es requerido.'),
  email: Yup.string().email('Email no válido.').required('El email es requerido.'),
  handle: Yup.string().required('El nombre de usuario es requerido.').min(3, 'El nombre de usuario debe tener al menos 3 caracteres.'),
  password: Yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres.'),
  line1: Yup.string(),
  line2: Yup.string(),
  city: Yup.string(),
  country: Yup.string(),
});

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  handle: '',
  password: '',
  line1: '',
  line2: '',
  city: '',
  country: '',
};

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/countries')
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  const handleSubmit = (values) => {
    axios.post('http://localhost:3001/api/v1/signup', { user: values })
      .then((response) => {
        const JWT_TOKEN = response.headers['authorization'];
        const CURRENT_USER_ID = response.data.data.id;

        if (JWT_TOKEN) {
          localStorage.setItem('JWT_TOKEN', JWT_TOKEN);
        }

        if (CURRENT_USER_ID) {
          localStorage.setItem('CURRENT_USER_ID', CURRENT_USER_ID);
        }

        navigate('/login');
      })
      .catch((error) => {
        console.error('Error during signup:', error);
      });
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5}>
        <Typography variant="h4" align='left' gutterBottom sx={{color: 'black', fontWeight:500 }}>
          Sign Up
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
                name="first_name"
                label="First name"
                fullWidth
                margin="normal"
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && errors.first_name}
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              />
              <Field
                as={TextField}
                name="last_name"
                label="Last name"
                fullWidth
                margin="normal"
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && errors.last_name}
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              />
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
                name="handle"
                label="Handle"
                fullWidth
                margin="normal"
                error={touched.handle && Boolean(errors.handle)}
                helperText={touched.handle && errors.handle}
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

              <Typography variant="subtitle1" align="left" gutterBottom sx={{color: 'grey', marginTop:5 }}>
                Optional Address Details
              </Typography>
              <Field
                as={TextField}
                name="line1"
                label="Line 1"
                fullWidth
                margin="normal"
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              />
              <Field
                as={TextField}
                name="line2"
                label="Line 2"
                fullWidth
                margin="normal"
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              />
              <Field
                as={TextField}
                name="city"
                label="City"
                fullWidth
                margin="normal"
                sx={{
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Country</InputLabel>
                <Field
                  as={Select}
                  name="country"
                  label="Country"
                  sx={{
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '5px',
                  }}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>

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
                  Sign Up
                </Button>
              </Box>
              <Box mt={2} textAlign="center">
                <Typography variant="body2" sx={{color: 'grey'}}>
                  Already have an account?{' '}
                  <Button color="primary" href="/login" sx={{color:'black', fontSize:14}}>
                    Sign In
                  </Button>
                </Typography>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
