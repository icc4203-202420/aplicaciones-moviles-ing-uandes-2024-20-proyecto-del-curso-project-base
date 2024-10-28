import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Input } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  firstname: Yup.string().required('El nombre es obligatorio'),
  lastname: Yup.string().required('El apellido es obligatorio'),
  handle: Yup.string().required('El handle es obligatorio'),
  email: Yup.string().email('Por favor, ingrese un email válido').required('El email es obligatorio'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es obligatoria'),
});

export default function Register({ navigation }) {
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('https://a559-201-214-18-177.ngrok-free.app/api/v1/signup', 
        {
          user: {
            first_name: values.firstname,
            last_name: values.lastname,
            handle: values.handle,
            email: values.email,
            password: values.password,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      

      if (response.status === 200) {
        alert('Registro Exitoso');
        navigation.navigate('Login');
      } else {
        alert(`Error: ${data.status.message}`);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Error en el registro');
    }
  };

  return (
    <Formik
      initialValues={{ firstname: '', lastname: '', handle: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.outercontainer}>
          <View style={styles.container}>
            <Input
              placeholder="Nombre"
              onChangeText={handleChange('firstname')}
              onBlur={handleBlur('firstname')}
              value={values.firstname}
              errorMessage={touched.firstname && errors.firstname ? errors.firstname : ''}
            />
            <Input
              placeholder="Apellido"
              onChangeText={handleChange('lastname')}
              onBlur={handleBlur('lastname')}
              value={values.lastname}
              errorMessage={touched.lastname && errors.lastname ? errors.lastname : ''}
            />
            <Input
              placeholder="@Handle"
              onChangeText={handleChange('handle')}
              onBlur={handleBlur('handle')}
              value={values.handle}
              errorMessage={touched.handle && errors.handle ? errors.handle : ''}
            />
            <Input
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              errorMessage={touched.email && errors.email ? errors.email : ''}
            />
            <Input
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
              errorMessage={touched.password && errors.password ? errors.password : ''}
            />

            {/* Reemplazamos Button por Pressable */}
            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Registrarse</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: 'blue' }]} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Ya tienes cuenta? Inicia Sesión</Text>
            </Pressable>
          </View>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  outercontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9a825',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
