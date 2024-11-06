import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { NGROK_URL } from '@env';
import { Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

const EventsShow = () => {
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [eventPictures, setEventPictures] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const { id } = useLocalSearchParams(); // Utiliza `useLocalSearchParams` para obtener el `id` del evento
  const router = useRouter();
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);

  const fetchEventData = useCallback(() => {
    axios.get(`${NGROK_URL}/api/v1/events/${id}`)
      .then(response => {
        setEvent(response.data);
        setVideoUrl(`${NGROK_URL}${response.data.video_url_path}`);
        setUsers(response.data.users);
        setEventPictures(response.data.event_pictures);
      })
      .catch(error => console.error('Error fetching event:', error));
  }, [id]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      const userId = await SecureStore.getItemAsync('USER_ID');
      await axios.post(`${NGROK_URL}/api/v1/attendances`, {
        user_id: parseInt(userId, 10),
        event_id: id,
      });
      Alert.alert('Checked-in', 'You have successfully checked in for this event.');
    } catch (error) {
      Alert.alert('Error', 'You are already registered for this event.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleAddPhoto = () => {
    router.push(`/events/${id}/add-photo`);
  };

  const handleGenerateVideo = async () => {
    try {
      await axios.post(`${NGROK_URL}/api/v1/events/${id}/generate_video`);
      Alert.alert('Success', 'Video generation started!');
    } catch (error) {
      Alert.alert('Error', 'There was an issue starting video generation.');
    }
  };

  const closeAttendeesModal = () => setShowAttendeesModal(false);

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
          data={users.slice(0, 5)} // Mostrar los primeros 5 asistentes
          renderItem={({ item }) => (
            <View style={styles.attendeeCard}>
              <View style={styles.attendeeAvatar}>
                <Text style={styles.avatarText}>{item.first_name[0]}</Text>
              </View>
              <Text style={styles.attendeeName}>{item.first_name} {item.last_name} </Text>
              <Text style={styles.attendeeHandle}>{item.handle}</Text>
            </View>
          )}
          keyExtractor={(user) => user.id.toString()}
        />
        {users.length > 5 && (
          <TouchableOpacity style={styles.moreButton} onPress={() => setShowAttendeesModal(true)}>
            <Text style={styles.moreButtonText}>...</Text>
          </TouchableOpacity>
        )}
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
        <TouchableOpacity onPress={handleAddPhoto}>
          <Text style={styles.addPhotoText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={eventPictures}
        renderItem={({ item }) => (
          <Image source={{ uri: item.picture.url }} style={styles.eventImage} />
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
        onRequestClose={closeAttendeesModal}
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
                    <Text style={styles.avatarText}>{item.first_name[0]}</Text>
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
  attendeesContainer: {
    marginTop: 10,
  },
  attendeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    elevation: 3, // For shadow on Android
    shadowColor: '#000', // Shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    backgroundColor: 'lightgray',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: 'white', fontWeight: 'bold' },
  attendeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  attendeeHandle: {
    fontSize: 14,
    color: 'gray',
  },
  moreButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  moreButtonText: {
    fontSize: 16,
    color: 'blue',
  },
});


export default EventsShow;
