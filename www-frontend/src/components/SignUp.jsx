import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Typography, Box, Grid, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import api from '../api';

function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post('/signup', {
        user: {
          email: data.email,
          password: data.password,
          password_confirmation: data.passwordConfirmation,
          first_name: data.firstName,
          last_name: data.lastName,
          handle: data.handle,
          address_attributes: {
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            country_id: data.countryId
          }
        }
      });
      navigate('/signin');
    } catch (error) {
      console.error('Registration error:', error.response?.data);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                {...register("firstName", { required: "First name is required" })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="handle"
                label="Handle"
                {...register("handle", { required: "Handle is required", pattern: { value: /^\w+$/, message: "Handle must start with @ and contain only letters, numbers, and underscores" } })}
                error={!!errors.handle}
                helperText={errors.handle?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="passwordConfirmation"
                label="Confirm Password"
                type="password"
                id="passwordConfirmation"
                {...register("passwordConfirmation", {
                  required: "Please confirm your password",
                  validate: (value) => value === document.getElementById('password').value || "Passwords do not match"
                })}
                error={!!errors.passwordConfirmation}
                helperText={errors.passwordConfirmation?.message}
              />
            </Grid>
            {/* Campos opcionales de dirección */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="line1"
                label="Address Line 1"
                {...register("line1")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="line2"
                label="Address Line 2"
                {...register("line2")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="city"
                label="City"
                {...register("city")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="countryId"
                label="Country ID"
                type="number"
                {...register("countryId")}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Link component={RouterLink} to="/signin" variant="body2">
            {"¿Ya tienes una cuenta? Sign In"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;