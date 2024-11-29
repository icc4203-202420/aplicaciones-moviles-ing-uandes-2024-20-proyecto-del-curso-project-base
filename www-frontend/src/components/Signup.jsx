import React from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../Signup.css'; 
import fetchAxios from '../Hooks/fetchaxios';
import {useNavigate} from 'react-router-dom';


function Signup() {
  const navigate = useNavigate();
  // Validación de campos usando Yup
  const validationSchema = Yup.object({
    first_name: Yup.string().required('Nombre es obligatorio'),
    last_name: Yup.string().required('Apellido es obligatorio'),
    email: Yup.string().email('Email no es válido').required('Email es obligatorio'),
    handle: Yup.string().required('Handle es obligatorio'),
    password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es obligatoria'),
    password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden').required('Confirmar contraseña es obligatorio'),
  });

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      handle: '',
      password: '',
      password_confirmation: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, {setSubmitting,validateForm}) => {
      try {
        const data = {"user": values};
        const response = await fetchAxios.post('/signup', data).then((response) => {
        alert('Usuario creado correctamente');  
        navigate("/login");
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
        label="Nombre"
        name="first_name"
        value={formik.values.first_name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.first_name && Boolean(formik.errors.first_name)}
        helperText={formik.touched.first_name && formik.errors.first_name}
        required
      />
      
      <TextField
        label="Apellido"
        name="last_name"
        value={formik.values.last_name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.last_name && Boolean(formik.errors.last_name)}
        helperText={formik.touched.last_name && formik.errors.last_name}
        required
      />
      
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
      label="Handle (e.g., @kingofbeers)"
      name="handle"
      value={formik.values.handle.startsWith('@') ? formik.values.handle : `@${formik.values.handle}`}
      onChange={e => {
        let value = e.target.value;
        if (!value.startsWith('@')) {
          value = `@${value}`;
        }
        formik.setFieldValue('handle', value);
      }}
      onBlur={formik.handleBlur}
      error={formik.touched.handle && Boolean(formik.errors.handle)}
      helperText={formik.touched.handle && formik.errors.handle}
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
      
      <TextField
        label="Confirmar Contraseña"
        name="password_confirmation"
        type="password"
        value={formik.values.password_confirmation}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password_confirmation && Boolean(formik.errors.password_confirmation)}
        helperText={formik.touched.password_confirmation && formik.errors.password_confirmation}
        required
      />
      
      <Button type="submit" variant="contained" color="primary">
        Registrarse
      </Button>
    </Box>
  );
}

export default Signup;
