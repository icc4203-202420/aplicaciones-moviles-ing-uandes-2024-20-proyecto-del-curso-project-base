import React, { useEffect, useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator, Image, FlatList, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { NGROK_URL } from '@env';
import { Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import SharePhoto from './SharePhoto';

const EventsShow = () => {
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [eventPictures, setEventPictures] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
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

            Alert.alert('Check-in confirmado', 'Te has registrado exitosamente.');
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
    try {
      await axios.post(`${NGROK_URL}/api/v1/events/${id}/generate_video`);
      Alert.alert('Success', 'Video generation started!');
    } catch (error) {
      Alert.alert('Error', 'There was an issue starting video generation.');
    }
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
      </View>
      <Text style={styles.eventDescription}>{event.description}</Text>

      <Text style={styles.sectionTitle}>Attendees</Text>
      <View style={styles.attendeesContainer}>
        <FlatList
          data={users} 
          renderItem={({ item }) => (
            <View style={styles.attendeeCard}>
              <Text style={styles.attendeeName}>{item.first_name} {item.last_name} </Text>
              <Text style={styles.attendeeHandle}>{item.handle}</Text>
            </View>
          )}
          keyExtractor={(user) => user.id.toString()}
          style={styles.attendeesList}
        />
      </View>

      <TouchableOpacity 
        style={styles.checkInButton} 
        onPress={handleCheckIn} 
        disabled={checkingIn}
      >
        {checkingIn ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.checkInText}>Check-In</Text>}
      </TouchableOpacity>
      
      <Text style={styles.sectionTitle}>Location</Text>
      <Text style={styles.location}>
        {event.bar && event.bar.address ? (
          `${event.bar.address.line1}\n${event.bar.address.line2}, ${event.bar.address.city}`
        ) : (
          "Location information not available"
        )}
      </Text>

      <View style={styles.photosHeader}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <TouchableOpacity onPress={handleSharePhoto}>
          <Text style={styles.addPhotoText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={eventPictures}
        renderItem={({ item }) => (
          item.image && item.image.url ? (
            <Image 
              source={{ uri: `${NGROK_URL}${item.image.url}` }} 
              style={styles.eventImage} 
            />
          ) : (
            <View style={styles.eventImagePlaceholder}>
              <Text>No Image Available</Text>
            </View>
          )
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {videoUrl && videoUrl.endsWith('.mp4') ? (
        <Video
          source={{ uri: videoUrl }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
        />
      ) : (
        <TouchableOpacity 
          style={styles.generateVideoButton} 
          onPress={handleGenerateVideo} 
          disabled={!isEventPast}
        >
          <Text style={styles.generateVideoText}>Generate Summary Video</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showAttendeesModal}
        onRequestClose={() => closeAttendeesModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Event Attendees</Text>
            <FlatList
              data={users}
              renderItem={({ item }) => (
                <View style={styles.attendeeCard}>
                  <View style={styles.attendeeAvatar}>
                    <Text style={styles.avatarText}>{item.first_name ? item.first_name[0] : ''}</Text>
                  </View>
                  <Text style={styles.attendeeName}>{item.first_name} {item.last_name}</Text>
                  <Text style={styles.attendeeHandle}>{item.handle}</Text>
                </View>
              )}
              keyExtractor={(user) => user.id.toString()}
            />
            <TouchableOpacity style={styles.closeModalButton} onPress={closeAttendeesModal}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <SharePhoto
          eventId={selectedEventId}
          eventName={selectedEventName}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, padding: 16 },
  eventTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
  detailsContainer: { marginVertical: 16 },
  hostedBy: { fontSize: 16, color: 'gray' },
  date: { fontSize: 14, color: 'gray', marginTop: 8 },
  checkInContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 },
  checkInButton: { backgroundColor: '#333', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5 },
  checkInText: { color: 'white', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  eventDescription: { color: 'gray', marginTop: 5 },
  location: { color: 'gray', marginTop: 5 },
  photosHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 },
  addPhotoText: { fontSize: 24, color: 'blue', marginLeft: 8 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  eventImage: { width: '100%', height: 200, borderRadius: 16, marginVertical: 10 },
  generateVideoButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 20, alignItems: 'center' },
  generateVideoText: { color: 'white', fontWeight: 'bold' },
  video: { width: '100%', height: 300, marginTop: 20 },
  attendeesContainer: { marginTop: 10 },
  attendeeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 8, padding: 10, marginVertical: 8, marginHorizontal: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  avatarText: { color: 'white', fontWeight: 'bold' },
  attendeeName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  attendeeHandle: { fontSize: 14, color: 'gray' },
  attendeesList: {
    maxHeight: 200,
    marginTop: 10,
  },
});

export default EventsShow;
