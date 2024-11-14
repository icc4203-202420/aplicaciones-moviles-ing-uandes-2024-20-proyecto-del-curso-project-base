import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, ActivityIndicator, Button, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import API_BASE_URL from '../Hooks/fetchAxios';

import { Video } from 'expo-av'; // Keep if you want to use video playback

function EventPhoto() {
    const navigation = useNavigation();
    const route = useRoute();
    const { eventId, barId } = route.params; // Get eventId and barId from route parameters
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]); // State for attendees
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state
    const [image, setImage] = useState(null); // State for selected image
    const [images, setImages] = useState([]); // State to hold uploaded images

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events/${eventId}`);
                if (response.status === 200) {
                    setEvent(response.data.event); // Adjust according to your API response structure

                    // Fetch attendees for this event at the specific bar
                    const attendeesResponse = await axios.get(`${API_BASE_URL}/bars/${barId}/events/${eventId}/attendees`);
                    setAttendees(attendeesResponse.data); // Assuming this returns the list of attendees

                    // Fetch uploaded images
                    await fetchImages(); // Fetch images right after fetching event details
                } else {
                    throw new Error('Failed to fetch event details');
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
                setError('Error fetching event details. Please try again later.'); // Set error message
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId, barId]);

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
            const response = await axios.post(`${API_BASE_URL}/bars/${barId}/events/${eventId}/event_pictures`, {
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
            const response = await axios.get(`${API_BASE_URL}/bars/${barId}/events/${eventId}/event_pictures`);
            if (response.data.images) {
                setImages(response.data.images); // Assuming the API response has an 'images' field
            }
        } catch (error) {
            console.error("Fetch images error:", error);
            Alert.alert("Error fetching images:", error.message);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorMessage}>{error}</Text> {/* Display error message */}
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorMessage}>No event details available.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.pageContainer}>
            <View style={styles.card}>
                <Text style={styles.eventTitle}>{event.name}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
                <Text style={styles.eventDate}>{new Date(event.date).toLocaleDateString()}</Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
                <Text style={styles.imagesTitle}>Attendees:</Text>
                
                <FlatList
                    data={attendees}
                    keyExtractor={(attendee) => attendee.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.attendeeItem}>
                            <Text>{item.first_name} {item.last_name}</Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />

                {/* Image Upload Section */}
                <Button title="Pick an image from gallery" onPress={pickImage} />
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <Button title="Upload Image" onPress={uploadImage} />

                {/* Display the uploaded images */}
                <FlatList
                    data={images}
                    keyExtractor={(item) => item.id.toString()} // Adjust according to your API response
                    renderItem={({ item }) => (
                        <Image source={{ uri: item.url }} style={styles.thumbnail} /> // Assuming 'url' holds the image source
                    )}
                    numColumns={3} // Display in 3 columns
                    columnWrapperStyle={styles.row} // Style for the rows
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#f9a825',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        elevation: 4, // For Android
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        padding: 20,
    },
    eventTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    eventDescription: {
        fontSize: 16,
        marginBottom: 10,
    },
    eventDate: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
    },
    eventLocation: {
        fontSize: 14,
        color: '#555',
        marginBottom: 20,
    },
    imagesTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    thumbnail: {
        width: 100,
        height: 100,
        margin: 5,
    },
});

export default EventPhoto;
