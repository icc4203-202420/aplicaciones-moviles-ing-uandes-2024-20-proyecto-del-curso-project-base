// src/components/Login.jsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('http://localhost:3001/api/v1/login', values);
      if (response.data.success) {
        login();
        navigate('/');
      } else {
        setErrors({ general: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      setErrors({ general: 'Login failed' });
    }
    setSubmitting(false);
  };
  

  return (
    <div>
      <Typography variant="h4">Login</Typography>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Field
              as={TextField}
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
            <Field
              as={TextField}
              label="Password"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
            />
            {errors.general && <Typography color="error">{errors.general}</Typography>}
            <Button type="submit" color="primary" variant="contained" disabled={isSubmitting}>
              Login
            </Button>
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
