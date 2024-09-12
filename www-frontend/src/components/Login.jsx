import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Container, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importa toast

// Esquema de validación usando Yup
const fieldsValidation = Yup.object({
  email: Yup.string().email('Email no válido.').required('El email es requerido.'),
  password: Yup.string().required('La contraseña es requerida'),
});

// Valores iniciales del formulario
const initialValues = {
  email: '',
  password: '',
};

function Login() {
  const [showPassword, setShowPassword] = useState(false); // Control de visibilidad de contraseña
  const [loginError, setLoginError] = useState(''); // Estado para el manejo de errores
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleSubmit = (values) => {
    axios.post('http://localhost:3001/api/v1/login', { user: values })
      .then(response => {
        const JWT_TOKEN = response.headers['authorization'];
        const CURRENT_USER_ID = response.data.status.data.user.id;

        // Almacenar el token y el ID de usuario en localStorage
        if (CURRENT_USER_ID) {
          localStorage.setItem('CURRENT_USER_ID', CURRENT_USER_ID);
        }
        if (JWT_TOKEN) {
          localStorage.setItem('JWT_TOKEN', JWT_TOKEN);
          toast.success('Succesfully Logged In'); // Mostrar mensaje de éxito
          
          // Redirigir al home después de 1 s
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        // Manejo de errores en la UI
        setLoginError('Credenciales inválidas. Intenta de nuevo.');
      });
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white' }}>
          Log In
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={fieldsValidation}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {/* Campo para el email */}
              <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                InputProps={{
                  style: { borderColor: '#91480c', color: 'white' },
                }}
                InputLabelProps={{
                  style: { color: 'white' },
                }}
              />
              {/* Campo para la contraseña */}
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
                  style: { borderColor: '#91480c', color: 'white' },
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
                  style: { color: 'white' },
                }}
              />
              {/* Botón de envío */}
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

        {/* Mostrar mensaje de error si hay algún error de inicio de sesión */}
        {loginError && (
          <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
            {loginError}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default Login;
