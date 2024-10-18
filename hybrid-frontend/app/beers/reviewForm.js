import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { Slider } from '@rneui/themed'; // Importa el Slider desde @rneui/themed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NGROK_URL } from '@env';
import axios from 'axios'; 

const ReviewForm = ({ beerId, onSubmit }) => {
  const [rating, setRating] = useState(3.0);
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Crear el estado de loading

  const countWords = (str) => {
    return str.trim().split(/\s+/).length; // Divide el texto en palabras utilizando espacios en blanco como delimitador
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    
    // Validar que el número de palabras sea mayor a 15
    const wordCount = countWords(text);
    if (rating < 1 || rating > 5) {
      setErrorMessage('La calificación debe estar entre 1 y 5.');
      return;
    }
    if (wordCount < 15) {
      setErrorMessage('El comentario debe tener al menos 15 palabras.');
      return;
    }

    setLoading(true);
    
    try {
      // Recuperar el token de AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('USER_ID'); // Obtener el user_id del almacenamiento

      if (!token || !userId) {
        throw new Error('No hay un token disponible para la autenticación o el usuario no está autenticado');
      }
      
      // Enviar la solicitud con axios, incluyendo los encabezados
      const response = await axios.post(
        `${NGROK_URL}/api/v1/beers/${beerId}/reviews`,
        {
          review: {
            rating, 
            text
          },
          user_id: userId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Agregar el token en los encabezados
          },
        }
      );
  
      if (response.status !== 201) { // Verificar si la respuesta tiene un código de éxito
        throw new Error(`Error al enviar la evaluación. Status: ${response.status}`);
      }
  
      console.log('Evaluación enviada con éxito');
      // Lógica adicional para actualizar la interfaz después de enviar la evaluación
      if (onSubmit) {
        onSubmit();
      }

      // Limpiar el formulario
      setRating(3.0);
      setText('');
      Alert.alert('Éxito', 'Reseña enviada con éxito.');
    } catch (error) {
      console.error('Error al enviar la evaluación:', error);
      setErrorMessage('Error al enviar la evaluación. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Calificación (1-5): {rating.toFixed(1)}</Text>
      <Slider
        value={rating}
        onValueChange={(value) => setRating(parseFloat(value.toFixed(1)))} // Configura el slider para que solo muestre un decimal
        minimumValue={1}
        maximumValue={5}
        step={0.1} // Incrementos de 0.1 para mayor precisión
        thumbTintColor="#007bff"
        minimumTrackTintColor="#007bff"
        maximumTrackTintColor="#ccc"
      />
      {errorMessage.includes('calificación') && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Comentario:</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        value={text}
        onChangeText={setText}
      />
      {errorMessage.includes('comentario') && <Text style={styles.error}>{errorMessage}</Text>}

      {errorMessage && !loading && <Text style={styles.error}>{errorMessage}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <Button title="Enviar evaluación" onPress={handleSubmit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  textArea: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default ReviewForm;
