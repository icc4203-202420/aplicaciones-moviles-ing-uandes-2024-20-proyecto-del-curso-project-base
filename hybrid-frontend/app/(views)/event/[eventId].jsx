import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';

const formatDate = (dateString) => {
  if (dateString) {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { day: 'numeric' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const hours = date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false });
    const minutes = date.toLocaleTimeString('en-US', { minute: '2-digit' });
    return `${month} ${day}, ${hours}:${minutes}`;
  }
  return 'Loading...';
};

export default function ShowEvent() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams();

  const [event, setEvent] = useState(null);
  const [friends, setFriends] = useState([]);
  const [attendants, setAttendants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [friendNames, setFriendNames] = useState([]);
  const [otherAttendees, setOtherAttendees] = useState([]);
  const [flyerUrls, setFlyerUrls] = useState([]);
  const [flyerData, setFlyerData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const goBack = () => {
    router.replace('(tabs)/events');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = JSON.parse(await SecureStore.getItemAsync('currentUser'));
        const token = (await SecureStore.getItemAsync('token')).replace(/['"]+/g, '').replace('Bearer ', '');

        // Cargar usuarios
        const usersResponse = await fetch(`${API_URL}/users`);
        const usersData = await usersResponse.json();
        setAllUsers(usersData?.users || []);

        // Cargar datos del evento
        const eventResponse = await fetch(`${API_URL}/events/${eventId}`);
        const eventData = await eventResponse.json();
        setEvent(eventData?.event || {});
        if (eventData?.event?.flyer_urls) {
          setFlyerUrls(eventData.event.flyer_urls);

          // Cargar imágenes del evento
          const picturesResponse = await fetch(`${API_URL}/events/${eventId}/event_pictures`);
          const picturesData = await picturesResponse.json();
          setFlyerData(picturesData?.event_pictures || []);
        }

        // Cargar asistentes
        const attendancesResponse = await fetch(`${API_URL}/attendances/${eventId}`);
        const attendanceData = await attendancesResponse.json();
        setAttendants(attendanceData?.attendance || []);

        // Cargar amigos
        const friendsResponse = await fetch(`${API_URL}/users/${user.id}/friendships`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const friendsData = await friendsResponse.json();
        setFriends(friendsData?.friendships.map(friend => friend.friend_id) || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  useEffect(() => {
    const friendIds = new Set(friends);
    const attendingUserIds = new Set(attendants.map(attendant => attendant.user_id));

    // Filtrar amigos y otros asistentes
    const filteredFriends = allUsers.filter(user => friendIds.has(user.id) && attendingUserIds.has(user.id));
    setFriendNames(filteredFriends);

    const otherAttendees = allUsers.filter(user => !friendIds.has(user.id) && attendingUserIds.has(user.id));
    setOtherAttendees(otherAttendees);
  }, [allUsers, friends, attendants]);

  const handleFileUpload = async () => {
    try {
      // Solicitar permisos
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Permission to access gallery is required!');
        return;
      }

      // Abrir la galería
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (pickerResult.cancelled) {
        console.log('Image selection cancelled.');
        return;
      }

      // Subir la imagen al servidor
      const formData = new FormData();
      formData.append('file', {
        uri: pickerResult.uri,
        name: 'upload.jpg',
        type: 'image/jpeg',
      });

      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Error uploading file');
      const result = await response.json();

      Alert.alert('Success', 'Image uploaded successfully');
      setFlyerUrls(result.event.flyer_urls || []);
      setFlyerData([...flyerData, { uri: pickerResult.uri }]); // Actualizar la lista localmente
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#C58100" />
      </View>
    );
  }

  if (!event) {
    return <Text style={styles.errorText}>Event not found.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>{event.name}</Text>
      <Text style={styles.date}>{formatDate(event.date)}</Text>
      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.attendees}>
        {friendNames.length > 0 && (
          <View style={styles.friends}>
            <Text style={styles.subHeader}>Friends Attending:</Text>
            <FlatList
              data={friendNames}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <Text>{item.first_name} {item.last_name} - @{item.handle}</Text>}
            />
          </View>
        )}
        {otherAttendees.length > 0 && (
          <View style={styles.others}>
            <Text style={styles.subHeader}>Other Attendees:</Text>
            <FlatList
              data={otherAttendees}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <Text>{item.first_name} {item.last_name} - @{item.handle}</Text>}
            />
          </View>
        )}
      </View>

      <View>
        <Text style={styles.subHeader}>Event Flyers</Text>
        {flyerUrls.map((url, index) => (
          flyerData[index] && (
            <View key={index} style={styles.flyer}>
              <Image source={{ uri: url }} style={styles.image} />
            </View>
          )
        ))}
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F1DCA7' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 30, fontWeight: 'bold', color: '#C58100', marginBottom: 20 },
  date: { fontSize: 16, color: '#564c3d', marginBottom: 10 },
  description: { fontSize: 16, color: '#564c3d', marginBottom: 20 },
  subHeader: { fontSize: 20, fontWeight: 'bold', color: '#C58100', marginBottom: 10 },
  image: { width: 300, height: 200, marginBottom: 10, borderRadius: 10 },
  flyer: { marginBottom: 20 },
  uploadButton: {
    backgroundColor: '#C58100',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  uploadButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  backButton: { backgroundColor: '#C58100', padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  backButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 20 },
});