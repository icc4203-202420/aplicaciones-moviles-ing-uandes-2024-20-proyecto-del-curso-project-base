import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api';

// eslint-disable-next-line react/prop-types
function SignIn({ setIsAuthenticated }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/login', {
        user: {
          email: data.email,
          password: data.password
        }
      });
      if (response.data && response.data.status && response.data.status.data) {
        const { token, user } = response.data.status.data;
        
        if (token && user && user.id) {
          localStorage.setItem('token', token);
          localStorage.setItem('userId', user.id);  // Almacena el userId
          setIsAuthenticated(true);
          navigate('/');
        } else {
          console.error('No token or userId received from server');
        }
        
      } else {
        console.error('No valid response from server');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Link component={RouterLink} to="/signup" variant="body2">
            {"¿No tienes una cuenta? Sign Up"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;