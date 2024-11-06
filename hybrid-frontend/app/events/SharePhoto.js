import React, { useState } from 'react';
import { View, Button, TextInput, Image, Alert, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { NGROK_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const SharePhoto = ({ eventId, eventName }) => {
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      name: 'photo.jpg',
    });
    formData.append('event_picture[description]', description);

    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Token de autenticación no encontrado.');
        setLoading(false);
        return;
      }

      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      await axios.post(`${NGROK_URL}/api/v1/events/${eventId}/event_pictures`, formData, {
        headers: {
          'Authorization': formattedToken,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Éxito', 'Foto subida con éxito.');
      setImageUri(null);
      setDescription('');
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.eventTitle}>{eventName}</Text>
      </View>

      <Button title="Seleccionar imagen" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TextInput
        placeholder="Descripción de la imagen"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
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
});

export default SharePhoto;
