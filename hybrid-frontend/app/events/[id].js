// src/components/EventCheckIn.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed'; // Asegúrate de que esto esté bien importado
import axios from 'axios';
import { NGROK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventCheckIn = ({ eventId }) => {
  const [message, setMessage] = useState('');

  const checkIn = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post(`${NGROK_URL}/api/v1/events/${eventId}/check_in`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage('Check-in exitoso. Se ha notificado a tus amigos.');
    } catch (err) {
      setMessage('Error al hacer check-in');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Button title="Hacer Check-in" onPress={checkIn} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  message: { marginTop: 10 }
});

export default EventCheckIn;
