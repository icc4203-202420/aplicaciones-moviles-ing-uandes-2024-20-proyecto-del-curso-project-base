import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Image, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Snackbar, Avatar } from 'react-native-paper';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRoute } from '@react-navigation/native';
import { backend_url } from '@env';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

const EventBar = () => {
  const route = useRoute();
  const { id: barId } = route.params;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDescription, setImageDescription] = useState('');

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

      if (mediaStatus !== 'granted' || cameraStatus !== 'granted') {
        alert('Permission to access media library and camera is required!');
      }
    }
  };

  useEffect(() => {
    requestPermissions();

    const fetchUserId = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync('userId');
        if (storedUserId) {
          setUserId(Number(storedUserId));
        } else {
          setError('User ID not found in SecureStore');
          setSnackbarVisible(true);
        }
      } catch (error) {
        setError('Failed to retrieve User ID');
        setSnackbarVisible(true);
      }
    };

    const fetchEvents = async () => {
      try {
        const eventsResponse = await axios.get(`${backend_url}/api/v1/bars/${barId}/events`);
        setEvents(eventsResponse.data.events || []);
      } catch (err) {
        setError('Failed to load events');
        setSnackbarVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
    fetchEvents();
  }, [barId]);

  const handleCloseSnackbar = () => {
    setSnackbarVisible(false);
  };

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleUploadImage = async (eventId) => {
    try {
      const token = await SecureStore.getItemAsync('jwtToken');

      if (!token) {
        setError('Token not found. Please log in again.');
        setSnackbarVisible(true);
        return;
      }

      const formData = new FormData();
      formData.append('event_picture[description]', imageDescription);
      formData.append('event_picture[image]', {
        uri: selectedImage.uri,
        type: 'image/jpeg',
        name: selectedImage.fileName || 'uploaded_image.jpg',
      });
      formData.append('event_picture[user_id]', userId);

      await axios.post(
        `${backend_url}/api/v1/bars/${barId}/events/${eventId}/event_pictures`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setImageDescription('');
      setSelectedImage(null);

    } catch (error) {
      setError('Failed to upload image. Please try again.');
      setSnackbarVisible(true);
    }
  };

  const handleCheckIn = async (eventId) => {
    try {
      const token = await SecureStore.getItemAsync('jwtToken');

      if (!token) {
        setError('Token not found. Please log in again.');
        setSnackbarVisible(true);
        return;
      }

      const data = { user_id: userId, event: String(eventId) };
      await axios.post(
        `${backend_url}/api/v1/bars/${barId}/events/${eventId}/check_in`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const eventsResponse = await axios.get(`${backend_url}/api/v1/bars/${barId}/events`);
      setEvents(eventsResponse.data.events || []);

    } catch (error) {
      setError('Failed to check in. Please try again.');
      setSnackbarVisible(true);
    }
  };

  const handleGenerateSummary = async (eventId) => {
    try {
      const token = await SecureStore.getItemAsync('jwtToken');

      if (!token) {
        setError('Token not found. Please log in again.');
        setSnackbarVisible(true);
        return;
      }

      await axios.post(
        `${backend_url}/api/v1/bars/${barId}/events/${eventId}/generate_summary`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setError('Video on progress, you will receive a notification when it is ready!');
      setSnackbarVisible(true);
    } catch (error) {
      setError('Something went worng, try again later');
      setSnackbarVisible(true);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text style={{ color: 'red' }}>{error}</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginVertical: 16 }}>Events at this Bar</Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: event }) => (
          <View style={{ marginVertical: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 16 }}>
            <Text style={{ fontSize: 18 }}>{event.name}</Text>
            <Text>{event.description}</Text>
            <Text>{new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>

            <Text style={{ marginTop: 10 }}>Attendees</Text>
            <ScrollView horizontal style={{ paddingVertical: 10 }}>
              {event.attendees && event.attendees.length > 0 ? (
                event.attendees.map((attendee) => (
                  <TouchableOpacity key={attendee.id} style={{ marginRight: 10, alignItems: 'center' }}>
                    <Avatar.Image size={40} source={{ uri: attendee.avatar_url }} />
                    <Text>{attendee.handle}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No attendees for this event</Text>
              )}
            </ScrollView>

            {new Date(event.date) < new Date() ? (
              event.summary_video_url ? (
                <Video
                  source={{ uri: event.summary_video_url }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  shouldPlay
                  style={{ width: 300, height: 200 }}
                />
              ) : (
                <Button title="Resumen" onPress={() => handleGenerateSummary(event.id)} />
              )
            ) : (
              event.user_has_checked_in ? (
                <Button title="You're in!" disabled />
              ) : (
                <Button title="Check In" onPress={() => handleCheckIn(event.id)} />
              )
            )}
          </View>
        )}
      />

      <Snackbar visible={snackbarVisible} onDismiss={handleCloseSnackbar} duration={3000}>
        {error}
      </Snackbar>
    </View>
  );
};

export default EventBar;