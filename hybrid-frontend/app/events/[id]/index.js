import React, { useEffect, useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator, Image, FlatList, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { NGROK_URL } from '@env';
import { Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import SharePhoto from '../SharePhoto';

const EventsShow = () => {
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [eventPictures, setEventPictures] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [videoGenerating, setVideoGenerating] = useState(false); // Estado para el modal de carga de video
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEventName, setSelectedEventName] = useState('');

  const closeAttendeesModal = () => setShowAttendeesModal(false);

  const fetchEventData = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');

      if (token) {
        const eventResponse = await axios.get(`${NGROK_URL}/api/v1/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvent(eventResponse.data);
        setUsers(eventResponse.data.users);
        setVideoUrl(`${NGROK_URL}${eventResponse.data.video_url_path}`);
      }
    } catch (error) {
      console.error('Error fetching event data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del evento.');
    }
  }, [id]);

  const fetchPictures = async () => {
    try {
      const response = await axios.get(`${NGROK_URL}/api/v1/events/${id}/pictures`);
      if (response.data && response.data.length > 0) {
        setEventPictures(response.data);
      } else {
        setEventPictures([]);
      }
    } catch (error) {
      console.error('Error fetching pictures:', error);
    }
  };

  useEffect(() => {
    fetchEventData();
    fetchPictures();
  }, [fetchEventData]);

  const handleSharePhoto = () => {
    setSelectedEventId(id);
    setSelectedEventName(event.name);
    setModalVisible(true);
  };

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const userId = await SecureStore.getItemAsync('USER_ID');
    
      if (token && userId) {
        const checkInResponse = await axios.post(
          `${NGROK_URL}/api/v1/events/${id}/attendances`,
          { user_id: userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (checkInResponse.status === 200) {
          const userResponse = await axios.get(
            `${NGROK_URL}/api/v1/users/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (userResponse.status === 200) {
            const user = userResponse.data;

            setUsers((prevUsers) => [
              { id: user.id, name: user.handle || 'You' },
              ...prevUsers
            ]);
          }
        }
      } else {
        Alert.alert('Error', 'Token de autenticación o ID de usuario no encontrado.');
      }
    } catch (error) {
      console.error('Error en check-in:', error);
      Alert.alert('Error', 'No se pudo realizar el check-in.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleGenerateVideo = async () => {
    setVideoGenerating(true); // Activar el modal de carga
    try {
      await axios.post(`${NGROK_URL}/api/v1/events/${id}/generate_video`);
      Alert.alert('Success', 'Video generation started!');
    } catch (error) {
      Alert.alert('Error', 'There was an issue starting video generation.');
    } finally {
      setVideoGenerating(false); // Desactivar el modal de carga
    }
  };
  
  const handleImageClick = (imageId) => {
    router.push(`/events/${id}/event_pictures/${imageId}`);
  };

  if (!event) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  const isEventPast = new Date(event.date) < new Date();

  return (
    <View style={styles.scrollContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      
      {/* Detalles del evento */}
      <View style={styles.detailsContainer}>
        <Text style={styles.eventTitle}>{event.name}</Text>
        <Text style={styles.date}>
          {new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        <Text style={styles.hostedBy}>
          {event.bar ? `Hosted by ${event.bar.name}` : 'Host information not available'}
        </Text>
        <Text style={styles.location}>
          {event.bar && event.bar.address ? (
            `${event.bar.address.line1}\n${event.bar.address.line2}, ${event.bar.address.city}`
          ) : (
            "Location not available"
          )}
        </Text>
      </View>

      {/* Modal de carga para la generación del video */}
      <Modal
        visible={videoGenerating}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.modalText}>Generating Video...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, padding: 16 },
  eventTitle: { fontSize: 25, fontWeight: 'bold', marginVertical: 5 },
  detailsContainer: { marginVertical: 16 },
  hostedBy: { fontSize: 16, color: 'gray' },
  date: { fontSize: 14, color: 'gray', marginTop: 3 },
  checkInButton: { backgroundColor: '#333', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5 },
  checkInText: { color: 'white', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  eventDescription: { color: 'gray', marginTop: 5 },
  location: { color: 'gray', marginTop: 5 },
  photosHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 },
  addPhotoText: { fontSize: 24, color: 'blue', marginLeft: 8 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  generateVideoButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  generateVideoText: { color: 'white', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: '#fff',
    marginTop: 10,
  },
});

export default EventsShow;
