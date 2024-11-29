import React, { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { token } = useAuth();
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    password: '',
  });

  const userId = localStorage.getItem('CURRENT_USER_ID');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId || !token) return;

      try {
        const response = await axios.get(`/api/v1/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const { first_name, last_name, email, age } = response.data;
        setInitialValues({ firstName: first_name, lastName: last_name, email, age, password: '' });
      } catch (error) {
        console.error('Error fetching user details:', error);
        // Optionally show an error toast here
      }
    };

    fetchUserDetails();
  }, [userId, token]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // Ensures formik reinitializes with updated initialValues
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      age: Yup.number().positive('Age must be a positive number').integer('Age must be an integer').required('Age is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters long') // Optional
    }),
    onSubmit: async (values) => {
      if (!userId || !token) return;

      try {
        await axios.put(`/api/v1/users/${userId}`, {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          age: values.age,
          password: values.password,
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        toast.success('Your account has been updated successfully!');
        navigate('/'); // Redirect to home page
      } catch (error) {
        console.error('Error updating user details:', error);
        toast.error('Failed to update account. Please try again.');
      }
    }
  });

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
          Edit Account
        </Typography>
        
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            fullWidth
            margin="normal"
            InputProps={{
              style: { borderColor: '#91480c', color: '#452216' },
            }}
            InputLabelProps={{
              style: { color: '#452216' },
            }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            fullWidth
            margin="normal"
            InputProps={{
              style: { borderColor: '#91480c', color: '#452216' },
            }}
            InputLabelProps={{
              style: { color: '#452216' },
            }}
          />
          <TextField
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
            margin="normal"
            InputProps={{
              style: { borderColor: '#91480c', color: '#452216' },
            }}
            InputLabelProps={{
              style: { color: '#452216' },
            }}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={formik.values.age}
            onChange={formik.handleChange}
            error={formik.touched.age && Boolean(formik.errors.age)}
            helperText={formik.touched.age && formik.errors.age}
            fullWidth
            margin="normal"
            InputProps={{
              style: { borderColor: '#91480c', color: '#452216' },
            }}
            InputLabelProps={{
              style: { color: '#452216' },
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            fullWidth
            margin="normal"
            InputProps={{
              style: { borderColor: '#91480c', color: '#452216' },
            }}
            InputLabelProps={{
              style: { color: '#452216' },
            }}
          />
          <Box mt={2}>
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
            >
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Account;
