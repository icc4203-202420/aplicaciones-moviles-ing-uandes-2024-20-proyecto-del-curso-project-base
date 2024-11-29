import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Alert, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import API_BASE_URL from '../Hooks/fetchAxios';

const ImageUploader = ({ barId, eventId }) => {
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]); // State to hold uploaded images

  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Function to upload the selected image
  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Please select an image first!");
      return;
    }

    // Convert image to base64
    const base64Image = await fetch(image)
      .then(response => response.blob())
      .then(blob => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      });

    try {
      const response = await axios.post(`${API_BASE_URL}/bars/1/events/1/event_pictures`, {
        image_base64: base64Image, // Send as base64
      }, {
        headers: {
          'Content-Type': 'application/json', // Use application/json for base64
        },
      });

      Alert.alert("Image uploaded successfully!", response.data.message);
      setImage(null); // Clear the selected image
      fetchImages(); // Fetch updated images after upload
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error uploading image:", error.response?.data?.errors || error.message);
    }
  };

  // Function to fetch uploaded images
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bars/1/events/1/event_pictures`);
      if (response.data.images) {
        setImages(response.data.images);
      }
    } catch (error) {
      console.error("Fetch images error:", error);
      Alert.alert("Error fetching images:", error.message);
    }
  };

  useEffect(() => {
    fetchImages(); // Fetch images when the component mounts
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Pick an image from gallery" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Upload Image" onPress={uploadImage} />

      {/* Display the uploaded images */}
      <FlatList
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item.url }} style={styles.thumbnail} /> 
        )}
        numColumns={3} // Display in 3 columns
        columnWrapperStyle={styles.row} // Style for the rows
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 5,
  },
  imageList: {
    marginTop: 20,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ImageUploader;
