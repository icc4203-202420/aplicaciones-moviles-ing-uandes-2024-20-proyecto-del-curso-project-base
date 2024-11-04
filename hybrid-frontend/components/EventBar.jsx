import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Image, TextInput, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Snackbar, Avatar } from 'react-native-paper';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRoute } from '@react-navigation/native';
import { backend_url } from '@env';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';

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
  const [availableUsers, setAvailableUsers] = useState([]);
  
  

  // Request media library and camera permissions
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media Library Permission Status:', mediaStatus);

      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Camera Permission Status:', cameraStatus);

      if (mediaStatus !== 'granted' || cameraStatus !== 'granted') {
        alert('Permission to access media library and camera is required!');
      }
    }
  };

  useEffect(() => {
    // Request permissions on component mount
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
        console.error('Error fetching user ID from SecureStore:', error);
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

  // Open the image picker
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

  const handleUserSelect = (userHandle) => {
    setImageDescription(prev => `${prev} @${userHandle} `);
    setAvailableUsers(availableUsers.filter(user => user.handle !== userHandle));
  };



  // Upload image with description
  const handleUploadImage = async (eventId, userId) => {
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
      formData.append('event_picture[user_id]', userId)

  
      const response = await axios.post(
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
      console.error('Error during image upload:', error);
  
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.message);
        if (error.response) {
          console.error('Response Data:', error.response.data);
          console.error('Response Status:', error.response.status);
        } else {
          console.error('Request Config:', error.config);
        }
      } else {
        console.error('Unexpected Error:', error);
      }
  
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

      const data = {
        user_id: userId,
        event: String(eventId),
      };

      await axios.post(
        `${backend_url}/api/v1/bars/${barId}/events/${eventId}/check_in`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const eventsResponse = await axios.get(`${backend_url}/api/v1/bars/${barId}/events`);
      setEvents(eventsResponse.data.events || []);

    } catch (error) {
      console.error('Error during check-in:', error);

      if (error.response) {
        if (error.response.status === 401) {
          setError('Unauthorized. Please check your token.');
        } else {
          setError('Failed to check in: ' + (error.response.data.message || 'Unknown error'));
        }
      } else {
        setError('Something went wrong. Please try again.');
      }

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

      const response = await axios.post(
        `${backend_url}/api/v1/bars/${barId}/events/${eventId}/generate_summary`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSnackbarVisible(true);
        setError('Video generation started. You will be notified when it is ready.');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setError('Failed to generate summary. Please try again.');
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
        renderItem={({ item: event }) => {
          const eventDate = new Date(event.date);
          const isEventPast = eventDate < new Date();

          return (
            <View style={{ marginVertical: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 16 }}>
              <Text style={{ fontSize: 18 }}>{event.name}</Text>
              <Text>{event.description}</Text>
              <Text>
                {eventDate.toLocaleDateString()} {' '}
                {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>

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

              {/* Conditionally render buttons based on event date */}
              {isEventPast ? (
                <>
                  <Button title="Summary" onPress={() => handleGenerateSummary(event.id)} />
                </>
              ) : (
                <>
                  {event.user_has_checked_in ? (
                    <Button title="You're in!" disabled />
                  ) : (
                    <Button title="Check In" onPress={() => handleCheckIn(event.id)} />
                  )}
                  <TextInput
                    placeholder="Image description"
                    value={imageDescription}
                    onChangeText={setImageDescription}
                    style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginTop: 10 }}
                  />
                  
                  <Button title="Select Image" onPress={handleSelectImage} />
                  {selectedImage && <Image source={{ uri: selectedImage.uri }} style={{ width: 200, height: 200, marginVertical: 10 }} />}
                  <Button
                    title="Upload Image"
                    onPress={() => handleUploadImage(event.id, userId)}
                    disabled={!selectedImage}
                  />
                  {event.event_pictures && event.event_pictures.length > 0 && (
                    <ScrollView horizontal style={{ maxHeight: 200, marginTop: 10 }}>
                      {event.event_pictures.map((picture) => (
                        <View key={picture.id} style={{ marginRight: 10 }}>
                          <Image source={{ uri: picture.image_url }} style={{ width: 100, height: 100, borderRadius: 8 }} />
                          <Text>{picture.description}</Text>
                        </View>
                      ))}
                    </ScrollView>
                      )}
                </>
              )}
            </View>
          );
        }}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={handleCloseSnackbar}
        duration={5000}
        action={{
          label: 'Close',
          onPress: handleCloseSnackbar,
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
};

export default EventBar;