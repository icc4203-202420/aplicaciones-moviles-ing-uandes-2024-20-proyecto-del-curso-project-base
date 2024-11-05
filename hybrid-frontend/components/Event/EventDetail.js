import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../Hooks/fetchAxios';

function EventDetail() {
    const navigation = useNavigation();
    const route = useRoute();
    const { eventId } = route.params; // Get eventId from route parameters
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/events/${eventId}`);
                if (response.status === 200) {
                    setEvent(response.data.event); // Adjust according to your API response structure
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
    }, [eventId]);

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
                <Text style={styles.eventDate}>Date: {new Date(event.date).toLocaleDateString()}</Text>
                <Text style={styles.eventLocation}>Bar: {event.bar_id}</Text>
                
                
                
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
        color: '#555',
    },
    eventDate: {
        color: '#666',
        fontSize: 14,
        marginBottom: 10,
    },
    eventLocation: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 20,
        color: '#333',
    },
    imagesTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: 120, // Adjust as needed
        height: 120, // Adjust as needed
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0', // Placeholder for image loading
    },
});

export default EventDetail;
