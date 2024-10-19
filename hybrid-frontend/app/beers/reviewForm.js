import { NGROK_URL } from '@env';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { Slider } from '@rneui/themed'; 
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

// Validation schema for the form
const validationSchema = Yup.object().shape({
  text: Yup.string()
    .required('Requiere de justificación para poder dejar un review')
    .test(
      'minWords',
      'El review debe tener al menos 15 palabras',
      (value) => value && value.split(' ').filter(word => word !== '').length >= 15
    ),
  rating: Yup.number().required('Debe seleccionar una calificación')
});

const BeerReviews = ({ beerId }) => { 
  const [serverError, setServerError] = useState('');
  const [rating, setRating] = useState(0);
  const router = useRouter();
  const handleSubmit = async (values, { setSubmitting }) => {
    // const userId = await AsyncStorage.getItem('USER_ID');
    const userId = await AsyncStorage.getItem('USER_ID');
    const token = await AsyncStorage.getItem('authToken');

    console.log("TOKEN:", token);
    console.log("USER ID:", userId);
    console.log("BEER ID:", beerId);

    if (!token || !userId || !beerId) {
      setServerError('No hay un token o usuario disponible para la autenticación o el beerId es inválido.');
      setSubmitting(false);
      return;
    }

    // values.user_id = userId;
    values.rating = rating;

    try {
      const response = await axios.post(
        `${NGROK_URL}/api/v1/beers/${beerId}/reviews`,
        { 
          review: { 
            rating: values.rating, 
            text: values.text,
          },
          user_id: userId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'USER_ID': userId
          }
        }
      );
      
      setServerError('');
      router.push("/beers");
      // router.back();
    } catch (err) {
      console.log('Error:', err);
      if (err.response) {
        // Mostrar el mensaje de error recibido del servidor
        console.log('Server Response:', err.response.data);
        if (err.response.status === 401) {
          setServerError('No autorizado. Verifique su token de autenticación.');
        } else if (err.response.status === 403) {
          setServerError('Acceso prohibido. Verifique sus permisos.');
        } else {
          setServerError('Error en el servidor. Intenta nuevamente más tarde.');
        }
      } else {
        setServerError('Error en la conexión. Verifica tu internet.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ text: '', rating: 0 }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View contentContainerStyle={styles.container}>
          <Text style={styles.label}>Calificación (1-5): {rating.toFixed(1)}</Text>
          <Slider
            value={rating}
            onValueChange={(value) => setRating(parseFloat(value.toFixed(1)))}
            minimumValue={1}
            maximumValue={5}
            step={0.1}
            thumbTintColor="#007bff"
            minimumTrackTintColor="#007bff"
            maximumTrackTintColor="#ccc"
            trackStyle={styles.sliderTrack}
            thumbStyle={styles.sliderThumb}
          />
          {serverError.includes('calificación') && <Text style={styles.error}>{serverError}</Text>}
          <Text style={styles.label}>Comentario:</Text>
          <TextInput
            style={[styles.textArea, serverError.includes('comentario') ? styles.inputError : null]}
            multiline
            numberOfLines={4}
            value={values.text}
            onChangeText={handleChange('text')}
            placeholder="Escribe tu reseña aquí..."
            placeholderTextColor="#aaa"
          />
          {touched.text && errors.text && <Text style={styles.error}>{errors.text}</Text>}
          {isSubmitting ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <Button title="Enviar evaluación" onPress={handleSubmit} />
          )}
          {serverError ? (
            <Text style={styles.error}>{serverError}</Text>
          ) : null}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  sliderTrack: {
    height: 15
  },
  sliderThumb: {
    height: 20,
    width: 20,
    backgroundColor: '#007bff',
  },
  textArea: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default BeerReviews;
