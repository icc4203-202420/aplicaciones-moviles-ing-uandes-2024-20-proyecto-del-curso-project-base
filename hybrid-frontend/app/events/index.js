import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import axios from 'axios';
import { NGROK_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const EventIndex = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${NGROK_URL}/api/v1/events`);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSharePhoto = (eventId) => {
    router.push(`/events/share-photo/${eventId}`);
  };

  const handleCheckIn = async (eventId) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Token de autenticación no encontrado.');
        return;
      }

      await axios.post(`${NGROK_URL}/api/v1/events/${eventId}/check_in`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      Alert.alert('Check-in exitoso. Se ha notificado a tus amigos.');
      console.log('CHECK IN');
    } catch (error) {
      console.error('Error al hacer check-in:', error);
      Alert.alert('Error al hacer check-in');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      {loading ? (
        <Text style={styles.loadingText}>Loading events...</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventTitle}>{item.name}</Text>
              <Text style={styles.eventDetails}>{item.date}</Text>
              <Text style={styles.eventDetails}>{item.location}</Text>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => handleSharePhoto(item.id)}
              >
                <Text style={styles.buttonText}>Share Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkInButton}
                onPress={() => handleCheckIn(item.id)}
              >
                <Text style={styles.buttonText}>Check In</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No events found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventItem: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  shareButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  checkInButton: {
    backgroundColor: '#ffc107',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default EventIndex;
