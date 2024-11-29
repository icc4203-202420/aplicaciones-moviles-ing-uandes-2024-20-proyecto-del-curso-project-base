import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, FlatList, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SearchFriendList from "./FriendList";
import API_BASE_URL from "../Hooks/fetchAxios";

export default function FriendsDetails() {
    const [friends, setFriends] = useState([]); 
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [currentUser, setCurrentUser] = useState(null); 

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userData = await AsyncStorage.getItem("user");
                if (userData) {
                    const user = JSON.parse(userData);
                    setCurrentUser(user);
                    fetchFriends(user.id);
                    fetchPendingRequests(user.id);
                }
            } catch (error) {
                console.error("Error al obtener currentUser:", error);
            }
        };
        fetchCurrentUser();
    }, []);

    const fetchFriends = async (userId) => {
        if (!userId) return;
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${userId}/friends`);
            setFriends(response.data);
        } catch (error) {
            console.error("Error al cargar amigos:", error);
        }
    };

    const fetchPendingRequests = async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/friendships?status=pending&user_id=${userId}`);
            setPendingRequests(response.data);
        } catch (error) {
            console.error("Error al cargar solicitudes pendientes:", error);
        }
    };

    const searchFriends = async () => {
        if (searchTerm.trim() !== "") {
            try {
                const response = await axios.get(`${API_BASE_URL}/users/search?handle=${searchTerm}`);
                setSearchResults(response.data); 
            } catch (error) {
                console.error("Error al buscar amigos:", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleAddFriend = async (friendId) => {
        if (!currentUser || !currentUser.id) return;
        try {
            const response = await axios.post(`${API_BASE_URL}/friendships`, {
                friendship: { user_id: currentUser.id, friend_id: friendId },
            });

            if (response.status === 200) {
                alert("Solicitud de amistad enviada");
            }
        } catch (error) {
            console.error("Error al enviar solicitud de amistad:", error);
        }
    };

    const handleAcceptRequest = async (friendshipId) => {
        try {
            await axios.put(`${API_BASE_URL}/friendships/${friendshipId}/accept`);
            setPendingRequests(pendingRequests.filter(req => req.id !== friendshipId));
            fetchFriends(currentUser.id); // Actualizar la lista de amigos
            alert("Solicitud de amistad aceptada");
        } catch (error) {
            console.error("Error al aceptar solicitud de amistad:", error);
        }
    };

    const handleDeclineRequest = async (friendshipId) => {
        try {
            await axios.put(`${API_BASE_URL}/friendships/${friendshipId}/decline`);
            setPendingRequests(pendingRequests.filter(req => req.id !== friendshipId));
            alert("Solicitud de amistad rechazada");
        } catch (error) {
            console.error("Error al rechazar solicitud de amistad:", error);
        }
    };

    return (
        <View style={styles.pageContainer}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Buscar Amigo Por Handle..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    onSubmitEditing={searchFriends}
                    style={styles.input}
                />
                
                <SearchFriendList
                    searchTerm={searchTerm}
                    friends={searchResults} 
                    handleAddFriend={handleAddFriend} 
                />

                <View style={styles.friendsContainer}>
                    <Text style={styles.sectionTitle}>Solicitudes Pendientes</Text>
                    <FlatList
                        data={pendingRequests}
                        keyExtractor={(request) => request.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.requestCard}>
                                <Text style={styles.friendName}>
                                    {item.user.first_name} {item.user.last_name} (@{item.user.handle})
                                </Text>
                                <View style={styles.buttonContainer}>
                                    <Button title="Aceptar" onPress={() => handleAcceptRequest(item.id)} />
                                    <Button title="Rechazar" onPress={() => handleDeclineRequest(item.id)} />
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.noRequestsText}>No tienes solicitudes pendientes.</Text>}
                    />

                    <Text style={styles.sectionTitle}>Tus Amigos</Text>
                    <FlatList
                        data={friends}
                        keyExtractor={(friend) => friend.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.friendCard}>
                                <Text style={styles.friendName}>
                                    {item.first_name} {item.last_name}
                                </Text>
                                <Text style={styles.friendHandle}>@{item.handle}</Text>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.noFriendsText}>No tienes amigos aún.</Text>}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#f9a825',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    friendsContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    friendCard: {
        backgroundColor: '#f1f1f1',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    friendName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f9a825',
    },
    friendHandle: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    noFriendsText: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginTop: 10,
    },
});