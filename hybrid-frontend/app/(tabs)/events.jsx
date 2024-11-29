import React, { useEffect, useState } from "react";
import { Text, View, FlatList, ActivityIndicator, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import {API_URL} from '@env';

const api = API_URL;

const ShowEvents = ({ data, option, attendances, handleAssistance, isAttending }) => {
    const filteredData = option
        ? data.filter(event => event.name.toLowerCase().includes(option.toLowerCase()))
        : data;

    return (
        <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
                const eventDate = new Date(item.date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleString('default', { month: 'short' });

                return (
                    <View style={styles.eventBox}>
                        <View style={styles.eventHeader}>
                            <Text style={styles.eventTitle}>{item.name}</Text>
                            <Text style={styles.eventDesc}>{item.description}</Text>
                        </View>
                        <View style={styles.eventContent}>
                            <View style={styles.eventDateBox}>
                                <Text style={styles.eventDay}>{day}</Text>
                                <Text style={styles.eventMonth}>{month.toUpperCase()}</Text>
                            </View>
                            <View style={styles.attendanceBox}>
                                <Text style={styles.confirmText}>Will you attend?</Text>
                                <TouchableOpacity
                                    style={[
                                        styles.attendanceButton,
                                        isAttending(item.id) ? styles.attendingButton : styles.confirmButton,
                                    ]}
                                    onPress={() => handleAssistance(item.id)}
                                >
                                    <Text style={styles.buttonText}>{isAttending(item.id) ? 'Attending' : 'Yes'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Link
                            style={styles.viewEventButton}
                            href={`(views)/event/${item.id}`}
                        >
                            <Text style={styles.viewEventButtonText}>View Event</Text>
                        </Link>
                    </View>
                );
            }}
        />
    );
};

const Events = () => {
    const [isLoading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    const getEvents = async () => {
        try {
            const response = await fetch(`${api}/events`);
            const data = await response.json();
            setEvents(data.events);
        } catch (error) {
            console.error("Error loading events data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSecureStore = async () => {
        try {
            const user = await SecureStore.getItemAsync('currentUser');
            const token = await SecureStore.getItemAsync('token');
            setToken(token.replace(/['"]+/g, ''));
            setUserId(JSON.parse(user).id);
        } catch (error) {
            console.error(error);
        }
    };

    const getAttendances = async () => {
        try {
            const response = await fetch(`${api}/users/${userId}/attendances`, {
                headers: {
                    Authorization: token
                }
            });
            const data = await response.json();
            setAttendances(data.attendances.map(attendance => attendance.event_id));
        } catch (error) {
            console.error("Error loading attendances data:", error);
        }
    };

    const handleAssistance = async (eventId) => {
        try {
            await fetch(`${api}/attendances`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({
                    user_id: userId,
                    event_id: eventId,
                    checked_in: true
                })
            });
            setAttendances([...attendances, eventId]);
        } catch (error) {
            console.error("Error checking in:", error);
        }
    };

    const isAttending = (id) => attendances.includes(id);

    useEffect(() => {
        fetchSecureStore();
    }, []);

    useEffect(() => {
        getEvents();
        if (userId && token) getAttendances();
    }, [userId, token]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Events</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search for an event"
                value={selectedOption}
                onChangeText={text => setSelectedOption(text)}
            />
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <ShowEvents
                    data={events}
                    option={selectedOption}
                    attendances={attendances}
                    handleAssistance={handleAssistance}
                    isAttending={isAttending}
                />
            )}
        </View>
    );
};

export default Events;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#F1DCA7',
        flex: 1,
    },
    title: {
        color: '#C58100',
        fontFamily: 'MontserratAlternates',
        fontSize: 42,
        fontWeight: '800',
        textAlign: 'center',
        textShadowColor: 'rgba(197, 129, 9, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 3,
        marginBottom: 15,
    },
    searchInput: {
        width: '100%',
        maxWidth: 350,
        padding: 15,
        fontSize: 16,
        borderColor: '#C58100',
        borderWidth: 1.5,
        borderRadius: 10,
        marginBottom: 20,
        alignSelf: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    eventBox: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        marginBottom: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    eventHeader: {
        marginBottom: 10,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#C58100',
    },
    eventDesc: {
        fontSize: 14,
        color: '#333',
    },
    eventContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventDateBox: {
        backgroundColor: '#C58100',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginRight: 15,
    },
    eventDay: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    eventMonth: {
        fontSize: 16,
        color: '#FFF',
        textTransform: 'uppercase',
    },
    attendanceBox: {
        flex: 1,
        alignItems: 'center',
    },
    confirmText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    attendanceButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    confirmButton: {
        backgroundColor: '#93DC5C',
    },
    attendingButton: {
        backgroundColor: '#93DC5C',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    viewEventButton: {
        backgroundColor: '#C58100',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    viewEventButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});