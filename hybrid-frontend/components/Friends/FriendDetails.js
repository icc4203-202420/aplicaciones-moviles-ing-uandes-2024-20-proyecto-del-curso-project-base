import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, FlatList, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SearchFriendList from "./FriendList";

export default function FriendsDetails() {
    const [friends, setFriends] = useState([]); 
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
            const response = await axios.get(`https://a559-201-214-18-177.ngrok-free.app/api/v1/users/${userId}/friends`)
            setFriends(response.data)
        } catch (error) {
            console.error("Error al cargar amigos:", error);
        }
    };

    const searchFriends = async () => {
        if (searchTerm.trim() !== "") {
            try {
                const response = await axios.get(`https://a559-201-214-18-177.ngrok-free.app/api/v1/users/search?handle=${searchTerm}`);
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
            const response = await axios.post(`https://a559-201-214-18-177.ngrok-free.app/api/v1/friendships`, {
                friendship: { user_id: currentUser.id, friend_id: friendId },
            });

            if (response.status === 200) {
                const newFriend = searchResults.find((friend) => friend.id === friendId);
                setFriends([...friends, newFriend]);
                alert("Amigo agregado con éxito");
            }
        } catch (error) {
            console.error("Error al agregar amigo:", error);
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
        color: '#333',
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