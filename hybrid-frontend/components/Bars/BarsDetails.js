import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../Hooks/fetchAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

function BarsDetails({ route }) {
    const { barId } = route.params; 
    const navigation = useNavigation(); // Get navigation object
    const [barDetails, setBarDetails] = useState(null);
    const [events, setEvents] = useState([]); 
    const [currentUser, setCurrentUser] = useState(null);
    const [checkedInEvents, setCheckedInEvents] = useState({});
    const [participants, setParticipants] = useState({});

    useEffect(() => {
        fetchBarDetails();
        fetchBarEvents();
        fetchCurrentUser();
        loadCheckedInEvents();
    }, []);

    useEffect(() => {
        if (events.length > 0) {
            loadCheckedInEvents();
        }
    }, [events]);

    const loadCheckedInEvents = async () => {
        try {
            const updatedCheckedInEvents = {};
            for (const event of events) {
                const checkedInStatus = await AsyncStorage.getItem(`checkedInEvents_${event.id}`);
                if (checkedInStatus) {
                    updatedCheckedInEvents[event.id] = JSON.parse(checkedInStatus);
                    fetchParticipants(event.id); 
                }
            }
            setCheckedInEvents(updatedCheckedInEvents);
        } catch (error) {
            console.error("Error loading checked-in events:", error);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                setCurrentUser(user);
            } else {
                console.error('User not found in AsyncStorage');
            }
        } catch (error) {
            console.error("Error fetching current user:", error);
        }
    };

    const fetchBarDetails = async () => {
        try {
            console.log(`Fetching details for bar ID: ${barId}`);
            const response = await axios.get(`${API_BASE_URL}/bars`);
            console.log("Response data from /api/v1/bars:", response.data);

            const bar = response.data.bars.find((bar) => bar.id === barId);
            if (bar) {
                console.log("Bar details found:", bar);
                setBarDetails(bar);
            } else {
                console.error('Bar not found in response data');
            }
        } catch (error) {
            console.error('Error fetching bar details:', error);
        }
    };

    const fetchBarEvents = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/bars/${barId}/events`);
            console.log("Events fetched for the bar:", response.data);
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching bar events:', error);
        }
    };

    const fetchParticipants = async (eventId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/bars/${barId}/events/${eventId}/attendees`);
            setParticipants((prev) => ({
                ...prev,
                [eventId]: response.data
            }));
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    };

    const handleCheckIn = async (eventId) => {
        if (!currentUser || !currentUser.id) {
            Alert.alert("Error", "User not found. Please log in again.");
            return;
        }
    
        try {
            const response = await axios.post(
                `${API_BASE_URL}/bars/${barId}/events/${eventId}/attendances`,
                { attendance: { user_id: currentUser.id, event_id: eventId, checked_in: true } }
            );
    
            if (response.status === 201) {
                Alert.alert("Check-in successful", "You have been registered for this event.");
                setCheckedInEvents((prev) => ({...prev, [eventId]: true}));
                await AsyncStorage.setItem(`checkedInEvents_${eventId}`, JSON.stringify(true));
                fetchParticipants(eventId);
            }
        } catch (error) {
            console.error('Error during check-in:', error);
            Alert.alert("Error", "Check-in could not be completed.");
        }
    };
    
    const handleCheckOut = async (eventId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/bars/${barId}/events/${eventId}/attendances/${currentUser.id}`
            );
    
            if (response.status === 200) {
                Alert.alert("Check-out successful", "You have been removed from this event.");
                setCheckedInEvents((prev) => ({...prev, [eventId]: false}));
                await AsyncStorage.removeItem(`checkedInEvents_${eventId}`);
                setParticipants((prev) => ({...prev, [eventId]: []}));
            }
        } catch (error) {
            console.error('Error during check-out:', error);
            Alert.alert("Error", "Check-out could not be completed.");
        }
    };

    if (!barDetails) {
        return <Text>Loading bar details...</Text>;
    }

    return (
        <ScrollView style={styles.pageContainer}>
            <View style={styles.detailsContainer}>
                <Text style={styles.barName}>{barDetails.name}</Text>
                <Text style={styles.barLocation}>
                    {barDetails.address?.line1}, {barDetails.address?.city}, {barDetails.address?.country?.name}
                </Text>
                <Text style={styles.barDescription}>Lat: {barDetails.latitude}, Long: {barDetails.longitude}</Text>
            </View>

            <View style={styles.eventsContainer}>
                <Text style={styles.sectionTitle}>Events at {barDetails.name}</Text>
                {events.length > 0 ? (
                    <FlatList
                        data={events}
                        keyExtractor={(event) => event.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.eventItem}>
                                <Text style={styles.eventName}>{item.name}</Text>
                                <Text style={styles.eventDate}>Date: {new Date(item.date).toLocaleDateString()}</Text>
                                <Text style={styles.eventDescription}>{item.description}</Text>

                                {/* Button to navigate to EventPhoto screen */}
                                <Pressable 
                                    style={styles.photoDetailsButton} 
                                    onPress={() => navigation.navigate('EventPhoto', { eventId: item.id })}>
                                    <Text style={styles.photoDetailsText}>View Bar Photos</Text>
                                </Pressable>

                                {checkedInEvents[item.id] ? (
                                    <>
                                        <View style={styles.participantsContainer}>
                                            <Text style={styles.participantsTitle}>Participants:</Text>
                                            {participants[item.id] ? (
                                                <FlatList
                                                    data={participants[item.id]}
                                                    keyExtractor={(participant) => participant.id.toString()}
                                                    renderItem={({ item: participant }) => (
                                                        <View style={styles.participantItem}>
                                                            <Text style={styles.participantName}>
                                                                {participant.first_name} {participant.last_name}
                                                            </Text>
                                                        </View>
                                                    )}
                                                />
                                            ) : (
                                                <Text>Loading participants...</Text>
                                            )}
                                        </View>
                                        <Pressable
                                            style={styles.checkOutButton}
                                            onPress={() => handleCheckOut(item.id)}
                                        >
                                            <Text style={styles.checkOutText}>Check Out</Text>
                                        </Pressable>
                                    </>
                                ) : (
                                    <Pressable
                                        style={styles.checkInButton}
                                        onPress={() => handleCheckIn(item.id)}
                                    >
                                        <Text style={styles.checkInText}>Check In</Text>
                                    </Pressable>
                                )}
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <Text style={styles.noEventsText}>No events available.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 20,
    },
    barName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    barLocation: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    barDescription: {
        fontSize: 14,
        color: '#555',
        marginTop: 8,
    },
    photoDetailsButton: {
        backgroundColor: '#2196F3', // Button color
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    photoDetailsText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    eventsContainer: {
        padding: 16,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    eventItem: {
        padding: 16,
        backgroundColor: '#e9e9e9',
        borderRadius: 8,
        marginBottom: 10,
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    eventDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    eventDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    checkInButton: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    checkInText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    checkOutButton: {
        backgroundColor: '#d9534f',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    checkOutText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    noEventsText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
    },
    participantsContainer: {
        marginTop: 10,
    },
    participantsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    participantItem: {
        marginVertical: 5,
    },
    participantName: {
        fontSize: 14,
        color: '#333',
    },
});

export default BarsDetails;
