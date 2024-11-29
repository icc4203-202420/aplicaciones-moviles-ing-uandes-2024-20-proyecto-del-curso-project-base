import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, Alert, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NGROK_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const EventImageForm = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [taggedFriends, setTaggedFriends] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;

  useEffect(() => {
    const fetchFriends = async () => {
      const userId = await SecureStore.getItemAsync('CURRENT_USER_ID');
      if (userId) {
        try {
          const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}`);
          setFriends(response.data.friends);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.error('User ID not found');
      }
    };
    fetchFriends();
  }, []);

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleTaggedFriend = (friendId) => {
    setTaggedFriends((prevTaggedFriends) =>
      prevTaggedFriends.includes(friendId) ? prevTaggedFriends.filter(id => id !== friendId) : [...prevTaggedFriends, friendId]
    );
  };

  const uploadImage = async () => {
    if (!image || !description) {
      Alert.alert('Error', 'Please select an image and enter a description.');
      return;
    }
    setUploading(true);
    try {
      const userId = await SecureStore.getItemAsync('CURRENT_USER_ID');
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append("event_picture[event_id]", eventId);
      formData.append("event_picture[user_id]", parseInt(userId, 10));
      formData.append("event_picture[description]", description);
      taggedFriends.forEach((friendId) => {
        formData.append("event_picture[tagged_friends][]", friendId);
      });      
      formData.append("event_picture[picture]", {
        uri: image,
        type: `image/${fileType}`,
        name: `photo.${fileType}`,
      });

      await axios.post(`${NGROK_URL}/api/v1/event_pictures`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Alert.alert('Success', 'The photo has been uploaded successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'There was a problem uploading the image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePlaceholder}>Select Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.title}>Tag Friends:</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.friendItem}
            onPress={() => toggleTaggedFriend(item.id)}
          >
            <Text style={styles.friendName}>{item.handle}</Text>
            <Text>{taggedFriends.includes(item.id) ? '✅' : '⬜️'}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[styles.uploadButton, uploading && styles.buttonDisabled]}
        onPress={uploadImage}
        disabled={uploading}
      >
        <Text style={styles.uploadButtonText}>{uploading ? 'Uploading...' : 'Upload Photo'}</Text>
      </TouchableOpacity>

      {uploading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f4f4f8', 
    alignItems: 'center', 
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginVertical: 10 
  },
  imageContainer: {
    width: 140,
    height: 140,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  imagePreview: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 12,
    resizeMode: 'cover' 
  },
  imagePlaceholder: { 
    color: 'white', 
    fontSize: 16 
  },
  input: { 
    width: '100%', 
    borderColor: '#ddd', 
    borderWidth: 1, 
    borderRadius: 10, 
    padding: 12, 
    backgroundColor: '#fff', 
    marginBottom: 20, 
    fontSize: 16,
    color: '#333'
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  friendName: { 
    fontSize: 16, 
    color: '#333' 
  },
  uploadButton: { 
    backgroundColor: '#FF8603', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center' 
  },
  buttonDisabled: { 
    backgroundColor: '#a0d0a8' 
  },
  uploadButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  loader: { 
    marginTop: 20 
  }
});

export default EventImageForm;
