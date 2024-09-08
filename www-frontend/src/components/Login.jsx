// import React, { useState } from 'react';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import { TextField, Button, Box, Container, Typography } from '@mui/material';
// import { Link } from 'react-router-dom';
// import useAxios from 'axios-hooks';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// // Configura Axios con la URL base de la API
// axios.defaults.baseURL = 'http://localhost:3001/api/v1'; // Cambia esta URL a la de tu backend

// const validationSchema = Yup.object({
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
// });

// const initialValues = {
//   email: '',
//   password: '',
// };

// const Login = ({ tokenHandler }) => {
//   const [serverError, setServerError] = useState('');
//   const navigate = useNavigate();

//   const [{ loading }, executePost] = useAxios(
//     {
//       url: '/login',
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' } // Cambiamos a JSON
//     },
//     { manual: true }
//   );

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await executePost({ data: JSON.stringify(values) });
//       const receivedToken = response.data.token;

//       if (receivedToken) {
//         tokenHandler(receivedToken);
//       }

//       setServerError('');
//       navigate('/');
//     } catch (err) {
//       if (err.response && err.response.status === 401) {
//         setServerError('Incorrect email or password.');
//       } else if (err.response) {
//         setServerError(`Server error: ${err.response.status}. ${err.response.data.message || 'Please try again later.'}`);
//       } else {
//         setServerError('An unknown error occurred. Please try again later.');
//       }
//       console.error('Error during form submission:', err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           width: '100%',
//           mt: 8,
//         }}
//       >
//         <Typography component="h1" variant="h5">
//           Log In
//         </Typography>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting, errors, touched }) => (
//             <Form style={{ width: '100%' }}>
//               <Box sx={{ mt: 2 }}>
//                 <Field
//                   as={TextField}
//                   fullWidth
//                   variant="outlined"
//                   label="Email"
//                   name="email"
//                   type="email"
//                   error={touched.email && Boolean(errors.email)}
//                   helperText={touched.email && errors.email}
//                   margin="normal"
//                 />
//               </Box>
//               <Box sx={{ mt: 2 }}>
//                 <Field
//                   as={TextField}
//                   fullWidth
//                   variant="outlined"
//                   label="Password"
//                   name="password"
//                   type="password"
//                   error={touched.password && Boolean(errors.password)}
//                   helperText={touched.password && errors.password}
//                   margin="normal"
//                 />
//               </Box>
//               <Box sx={{ mt: 3 }}>
//                 <Button
//                   type="submit"
//                   fullWidth
//                   variant="contained"
//                   color="primary"
//                   disabled={isSubmitting || loading}
//                 >
//                   {loading ? 'Submitting...' : 'Log In'}
//                 </Button>
//               </Box>
//               {serverError && (
//                 <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
//                   {serverError}
//                 </Typography>
//               )}
//             </Form>
//           )}
//         </Formik>
//         <Box sx={{ mt: 2 }}>
//           <p>
//             Don't have an account? <Link to="/signup">Sign up</Link>
//           </p>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default Login;

// import React, { useState } from 'react';
// import { Formik, Form, Field } from 'formik';
// import * as Yup from 'yup';
// import { TextField, Button, Box, Container, Typography, InputAdornment, IconButton } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const fieldsValidation = Yup.object({
//   email: Yup.string().email('Email no válido.').required('El email es requerido.'),
//   password: Yup.string().required('La contraseña es requerida'),
// });

// const initialValues = {
//   email: '',
//   password: '',
// };

// export default function Login() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginSuccess, setLoginSuccess] = useState(false); // Estado para controlar si el login es exitoso
//   const navigate = useNavigate();

//   const handleSubmit = (values) => {
//     axios.post('http://localhost:3001/api/v1/login', { user: values })
//       .then(response => {
//         const JWT_TOKEN = response.headers['authorization'];
//         const CURRENT_USER_ID = response.data.status.data.user.id;
//         if (CURRENT_USER_ID) {
//             localStorage.setItem('CURRENT_USER_ID', CURRENT_USER_ID);
//             setLoginSuccess(true);
//           }
//         if (JWT_TOKEN) {
//           localStorage.setItem('JWT_TOKEN', JWT_TOKEN);
//           setLoginSuccess(true); // Establecer a true cuando el login es exitoso
          
//           // Redirigir al home después de un tiempo, si es necesario
//           setTimeout(() => {
//             navigate('/');
//           }, 2000); // 2 segundos de espera antes de redirigir
//         }
//       })
//       .catch(error => {
//         console.error('Error logging in:', error);
//       });
//   };

//   return (
//     <Container maxWidth="xs">
//       <Box mt={5}>
//         {loginSuccess ? ( // Mostrar el mensaje si el login fue exitoso
//           <Typography variant="h5" align="center" sx={{ color: 'green' }}>
//             ¡Has iniciado sesión correctamente!
//           </Typography>
//         ) : (
//           <>
//             <Typography variant="h4" align="center" gutterBottom sx={{ color: 'white' }}>
//               Log In
//             </Typography>

//             <Formik
//               initialValues={initialValues}
//               validationSchema={fieldsValidation}
//               onSubmit={handleSubmit}
//             >
//               {({ errors, touched, isSubmitting }) => (
//                 <Form>
//                   <Field
//                     as={TextField}
//                     name="email"
//                     label="Email"
//                     fullWidth
//                     margin="normal"
//                     error={touched.email && Boolean(errors.email)}
//                     helperText={touched.email && errors.email}
//                     InputProps={{
//                       style: { borderColor: '#91480c', color: 'white' },
//                     }}
//                     InputLabelProps={{
//                       style: { color: 'white' },
//                     }}
//                   />
//                   <Field
//                     as={TextField}
//                     name="password"
//                     label="Password"
//                     type={showPassword ? 'text' : 'password'}
//                     fullWidth
//                     margin="normal"
//                     error={touched.password && Boolean(errors.password)}
//                     helperText={touched.password && errors.password}
//                     InputProps={{
//                       style: { borderColor: '#91480c', color: 'white' },
//                       endAdornment: (
//                         <InputAdornment position="end">
//                           <IconButton
//                             aria-label="toggle password visibility"
//                             onClick={() => setShowPassword(!showPassword)}
//                             edge="end"
//                           >
//                             {showPassword ? <Visibility /> : <VisibilityOff />}
//                           </IconButton>
//                         </InputAdornment>
//                       ),
//                     }}
//                     InputLabelProps={{
//                       style: { color: 'white' },
//                     }}
//                   />
//                   <Box mt={2}>
//                     <Button
//                       type="submit"
//                       fullWidth
//                       disabled={isSubmitting}
//                       variant="contained"
//                       sx={{
//                         backgroundColor: '#91480c',
//                         color: 'white',
//                         '&:hover': {
//                           backgroundColor: '#702f07',
//                         },
//                       }}
//                     >
//                       Log in
//                     </Button>
//                   </Box>
//                 </Form>
//               )}
//             </Formik>
//           </>
//         )}
//       </Box>
//     </Container>
//   );
// }



import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Container, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false); // Control de visibilidad de contraseña
  const [loginSuccess, setLoginSuccess] = useState(false); // Estado para éxito de inicio de sesión
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
          setLoginSuccess(true); // Establecer éxito del login
          
          // Redirigir al home después de 2 segundos
          setTimeout(() => {
            navigate('/');
          }, 2000);
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
        {loginSuccess ? ( // Mostrar mensaje de éxito si el login fue exitoso
          <Typography variant="h5" align="center" sx={{ color: 'green' }}>
            ¡Has iniciado sesión correctamente!
          </Typography>
        ) : (
          <>
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
          </>
        )}
      </Box>
    </Container>
    );
}

