import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../Hooks/fetchAxios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function BarsDetails({ route }) {
    const { barId } = route.params; 
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
                    fetchParticipants(event.id); // Cargar participantes si está en el evento
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
                console.error('Usuario no encontrado en AsyncStorage');
            }
        } catch (error) {
            console.error("Error fetching current user:", error);
        }
    };

    const fetchBarDetails = async () => {
        try {
            console.log(`Fetching details for bar ID: ${barId}`);
            const response = await axios.get(`${API_BASE_URL}/bars`); // Asegúrate de actualizar <ngrok-url>
            console.log("Response data from /api/v1/bars:", response.data); // Mostrar la estructura de respuesta

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

    // Obtener eventos del bar
    const fetchBarEvents = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/bars/${barId}/events`);
            console.log("eventos obtenidos por el bar", response.data);
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
            Alert.alert("Error", "Usuario no encontrado. Inicia sesión nuevamente.");
            return;
        }
    
        try {
            const response = await axios.post(
                `${API_BASE_URL}/bars/${barId}/events/${eventId}/attendances`,
                { attendance: { user_id: currentUser.id, event_id: eventId, checked_in: true } }
            );
    
            if (response.status === 201) {
                Alert.alert("Check-in realizado", "Has sido registrado en este evento.");
                setCheckedInEvents((prev) => ({...prev, [eventId]: true}));
                await AsyncStorage.setItem(`checkedInEvents_${eventId}`, JSON.stringify(true));
                fetchParticipants(eventId);
            }
        } catch (error) {
            console.error('Error al realizar check-in:', error);
            Alert.alert("Error", "No se pudo completar el check-in.");
        }
    };
    
    const handleCheckOut = async (eventId) => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/bars/${barId}/events/${eventId}/attendances/${currentUser.id}`
            );
    
            if (response.status === 200) { // Verifica si tu controller responde con el estado 200
                Alert.alert("Check-out realizado", "Has sido eliminado de este evento.");
                setCheckedInEvents((prev) => ({...prev, [eventId]: false}));
                await AsyncStorage.removeItem(`checkedInEvents_${eventId}`);
                setParticipants((prev) => ({...prev, [eventId]: []}));
            }
        } catch (error) {
            console.error('Error al realizar check-out:', error);
            Alert.alert("Error", "No se pudo completar el check-out.");
        }
    };

    if (!barDetails) {
        return <Text>Cargando detalles del bar...</Text>;
    }

    return (
        <ScrollView style={styles.pageContainer}>
            <View style={styles.detailsContainer}>
                <Text style={styles.barName}>{barDetails.name}</Text>
                <Text style={styles.barLocation}>
                    {barDetails.address?.line1}, {barDetails.address?.city}, {barDetails.address?.country?.name}
                </Text>
                <Text style={styles.barDescription}>Latitud: {barDetails.latitude}, Longitud: {barDetails.longitude}</Text>
            </View>

            <View style={styles.eventsContainer}>
                <Text style={styles.sectionTitle}>Eventos en {barDetails.name}</Text>
                {events.length > 0 ? (
                    <FlatList
                        data={events}
                        keyExtractor={(event) => event.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.eventItem}>
                                <Text style={styles.eventName}>{item.name}</Text>
                                <Text style={styles.eventDate}>Fecha: {new Date(item.date).toLocaleDateString()}</Text>
                                <Text style={styles.eventDescription}>{item.description}</Text>

                                {checkedInEvents[item.id] ? (
                                    <>
                                        <View style={styles.participantsContainer}>
                                            <Text style={styles.participantsTitle}>Participantes:</Text>
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
                                                <Text>Cargando participantes...</Text>
                                            )}
                                        </View>
                                        <Pressable
                                            style={styles.checkOutButton}
                                            onPress={() => handleCheckOut(item.id)}
                                        >
                                            <Text style={styles.checkOutText}>Salir del Evento</Text>
                                        </Pressable>
                                    </>
                                ) : (
                                    <Pressable
                                        style={styles.checkInButton}
                                        onPress={() => handleCheckIn(item.id)}
                                    >
                                        <Text style={styles.checkInText}>Hacer Check-In</Text>
                                    </Pressable>
                                )}
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <Text style={styles.noEventsText}>No hay eventos disponibles.</Text>
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