import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';
import { Slider } from '@rneui/themed'; // Importa el Slider desde @rneui/themed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NGROK_URL } from '@env';
import axios from 'axios'; 
const ReviewForm = ({ beerId, onSubmit }) => {
  const [rating, setRating] = useState(3.0);
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Crear el estado de loading

  const handleSubmit = async () => {
    setErrorMessage('');
    setLoading(true);
    
    try {
      // Recuperar el token de AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No hay un token disponible para la autenticación');
      }
      
      const response = await axios.post(`${NGROK_URL}/api/v1/beers/${beerId}/reviews`, {
          review: {
            rating, 
            text,
          },
        // headers: {
        //   'Content-Type': 'application/json',
        //   'Authorization': `Bearer ${token}`, // Agregar el token en los encabezados
        // },
        // body: JSON.stringify({
        //   review: {
        //     rating,
        //     text,
        //   },
        // }),
      });
  
      if (!response.ok) {
        throw new Error(`Error al enviar la evaluación. Status: ${response.status}`);
      }
  
      console.log('Evaluación enviada con éxito');
      // Lógica adicional para actualizar la interfaz después de enviar la evaluación
      if (onSubmit) {
        onSubmit();
      }
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
      <Text style={styles.label}>Comentario:</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        value={text}
        onChangeText={setText}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
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
