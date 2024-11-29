import React from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import fetchAxios from '../Hooks/fetchaxios';
import {useNavigate} from 'react-router-dom';


function Login({setLogUser}) {
  const navigate = useNavigate();
  // Validación de campos usando Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Email no es válido').required('Email es obligatorio'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es obligatoria'),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, {setSubmitting,validateForm}) => {
      try {
        const data = {"user": values};
        const response = await fetchAxios.post('/login', data).then((response) => {
            const user = response.data.status.data.user;
            localStorage.setItem('loguser', JSON.stringify(user));
            setLogUser(user);
            alert('Ingresaste correctamente');  
            navigate("/");
        });
        
        console.log(response.data);
  
        validateForm();
 
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 450, margin: 'auto', padding: 2, boxShadow: 4 }}
    >
      <Typography variant="h5" align="center">
        Crear cuenta
      </Typography>

      
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        required
      />

      
      
      <TextField
        label="Contraseña"
        name="password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        required
      />
      
      <Button type="submit" variant="contained" color="primary">
        Registrarse
      </Button>
    </Box>
  );
}

export default Login;
