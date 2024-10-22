import React, { useState } from 'react';
import { View, Button, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Make sure the import is correct
import axios from 'axios';
import { NGROK_URL } from '@env';

const SharePhoto = ({ eventId }) => {
  const [imageUri, setImageUri] = useState(null);
  const [tags, setTags] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  const uploadPhoto = async () => {
    const formData = new FormData();
    formData.append('event_picture[image]', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    formData.append('event_picture[tag_handles][]', tags.split(','));

    try {
      await axios.post(`${NGROK_URL}/api/v1/events/${eventId}/event_pictures`, formData);
      alert('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <View>
      <Button title="Pick an image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />}
      <TextInput
        placeholder="Enter handles to tag (comma-separated)"
        value={tags}
        onChangeText={setTags}
      />
      <Button title="Upload Photo" onPress={uploadPhoto} />
    </View>
  );
};

export default SharePhoto;
