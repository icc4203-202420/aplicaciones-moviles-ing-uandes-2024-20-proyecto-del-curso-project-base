import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from '../Hooks/fetchAxios';

function EventsList() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/events`); // Your API endpoint
            console.log('Eventos Recibidos', response.data); // Log the entire response
            setEvents(Array.isArray(response.data)? response.data : []); // Update the state with the beers data
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    
    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    return (
        <ScrollView style={styles.pageContainer}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Busca eventos..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    style={styles.input}
                />
                <View style={styles.listContainer}>
                    <FlatList
                        data={filteredEvents}
                        keyExtractor={event => event.id.toString()}
                        renderItem={({ item }) => (
                            <Pressable 
                                onPress={() => navigation.navigate('EventDetail', { eventId: item.id })} 
                                style={styles.eventButton}
                            >
                                <Text style={styles.eventText}>{item.name}</Text>
                                <Text style={styles.eventDate}>fecha: {new Date(item.date).toLocaleDateString()}</Text>
                                <Text style={styles.barName}>Bar: {item.bar?.name || 'No disponible'} </Text>
                            </Pressable>
                        )}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                </View>
            </View>
        </ScrollView>
    );
} 

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0', // Mismo color del login
    },
    container: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    input: {
        padding: 10,
        borderBottomWidth: 1,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    listContainer: {
        flex: 1,
    },
    eventButton: {
        backgroundColor: '#ccc', // Botones en gris
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    eventText: {
        color: '#f0f0f0', // Color del background del login para el texto
        fontSize: 16,
    },
    eventDate: {
        color: '#666',
        fontSize: 14,
    },
});

export default EventsList;