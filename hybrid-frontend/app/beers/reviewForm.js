// app/beers/reviewForm.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Button, Slider } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReviewForm = ({ beerId, onSubmit }) => {
  const [rating, setRating] = useState(3);
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (text.split(' ').length < 15) {
      setErrorMessage('La evaluación debe tener al menos 15 palabras.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setErrorMessage('La calificación debe estar entre 1 y 5.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken'); // Obtén el token de autenticación
      const response = await fetch(`http://192.168.4.179:3000/api/v1/beers/${beerId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluye el token en los encabezados
        },
        body: JSON.stringify({ review: { rating, text } }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la evaluación. Status: ' + response.status);
      }

      const data = await response.json();
      onSubmit(data); // Llama a la función onSubmit pasada por props
      setText('');
      setRating(3);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error al enviar la evaluación. Por favor, inténtelo de nuevo.');
      console.error('Error al enviar la evaluación:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Calificación: {rating}</Text>
      <Slider
        value={rating}
        onValueChange={setRating}
        minimumValue={1}
        maximumValue={5}
        step={0.1}
        style={styles.slider}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Escribe tu evaluación..."
        multiline
        numberOfLines={4}
        value={text}
        onChangeText={setText}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="Enviar" onPress={handleSubmit} buttonStyle={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  slider: {
    marginBottom: 20,
  },
  textInput: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
  },
});

export default ReviewForm;
