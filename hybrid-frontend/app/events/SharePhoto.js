import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, Image, Alert, StyleSheet, Text, TouchableOpacity, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { NGROK_URL } from '@env';
import { useRouter } from 'expo-router';

const SharePhoto = ({ eventId, eventName }) => {
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const router = useRouter();

  const fetchFriends = async () => {
    try {
      const userId = await SecureStore.getItemAsync('USER_ID');
      const token = await SecureStore.getItemAsync('authToken');

      if (!userId || !token) {
        console.error('User ID or token not found');
        return;
      }

      const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}/friendships`, {
      });

      if (response.status === 200) {
        setFriends(response.data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prevSelectedFriends =>
      prevSelectedFriends.includes(friendId)
        ? prevSelectedFriends.filter(id => id !== friendId)
        : [...prevSelectedFriends, friendId]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadPhoto = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'No se ha seleccionado ninguna imagen.');
      return;
    }
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append('event_picture[image]', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `photo_${Date.now()}.jpg`,
    });
    formData.append('event_picture[description]', description);
    formData.append('event_picture[event_id]', eventId); // Add event_id to the form data
    formData.append('event_picture[user_id]', await SecureStore.getItemAsync('USER_ID')); // Add user_id to the form data
  
    selectedFriends.forEach(friendId => {
      formData.append('event_picture[tag_handles][]', friendId);
    });
  
    try {
      await axios.post(`${NGROK_URL}/api/v1/events/${eventId}/event_pictures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      Alert.alert('Éxito', 'Foto subida con éxito.');
      setImageUri(null);
      setDescription('');
      setSelectedFriends([]);
  
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error('Error al subir la foto:', error.response || error.message);
      Alert.alert('Error', 'Error al subir la foto.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push(`/events/${eventId}`)} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.eventTitle}>{eventName}</Text>
      </View>

      <Button title="Seleccionar imagen" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TextInput
        placeholder="Describe tu foto"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Text style={styles.subHeader}>Etiqueta amigos:</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendContainer}>
            <View>
              <Text style={styles.friendName}>{`${item.first_name} ${item.last_name}`}</Text>
              <Text style={styles.friendHandle}>@{item.handle}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.selectionBox,
                selectedFriends.includes(item.id) && styles.selectedBox
              ]}
              onPress={() => toggleFriendSelection(item.id)}
            >
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Subir foto" onPress={uploadPhoto} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#ffffff', // Set background to white
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    marginVertical: 15,
    borderRadius: 10,
  },
  input: {
    borderBottomWidth: 1,
    width: '100%',
    marginBottom: 15,
    padding: 5,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  friendContainer: {
    width: Dimensions.get('window').width - 80,
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendHandle: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
  selectionBox: {
    width: 30,
    height: 30,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBox: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  selectionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SharePhoto;