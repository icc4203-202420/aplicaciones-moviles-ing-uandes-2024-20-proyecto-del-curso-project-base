import React, { useEffect, useState } from "react";
import { Text, View, FlatList, ActivityIndicator, TextInput, StyleSheet, TouchableOpacity, Modal } from "react-native";
import AddFriend from '../../assets/AddFriend';
import Friend from '../../assets/Friend';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';

const api = API_URL;

const ShowUsers = ({ data, option, friends, togglePopUp, popUp, bars, addFriend }) => {
    const filteredData = option
        ? data.filter(user => user.handle.toLowerCase().includes(option.toLowerCase()))
        : data;

    return (
        <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.userBox}>
                    <Text style={styles.userItem}>{item.handle}</Text>
                    {friends.includes(item.id) ? (
                        <Friend width={24} height={24} />
                    ) : (
                        <TouchableOpacity onPress={() => togglePopUp(item.id)}>
                            <AddFriend width={24} height={24} />
                        </TouchableOpacity>
                    )}
                    {/* Modal para seleccionar el lugar donde se hicieron amigos */}
                    {popUp[item.id] && (
                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={popUp[item.id]}
                            onRequestClose={() => togglePopUp(item.id)}
                        >
                            <View style={styles.popUpOverlay}>
                                <View style={styles.popUpContent}>
                                    <Text style={styles.popUpTitle}>Where did you become friends?</Text>
                                    <FlatList
                                        data={bars}
                                        keyExtractor={(bar) => bar.id.toString()}
                                        renderItem={({ item: bar }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    addFriend(item.id, bar.id);
                                                    togglePopUp(item.id);
                                                }}
                                            >
                                                <Text style={styles.barItem}>{bar.name}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            addFriend(item.id, null); // Si no se selecciona ningún bar
                                            togglePopUp(item.id);
                                        }}
                                        style={styles.noneButton}
                                    >
                                        <Text style={styles.noneButtonText}>None</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    )}
                </View>
            )}
        />
    );
};

export default function Users() {
    const [users, setUsers] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');
    const [userId, setUserId] = useState(null);
    const [friends, setFriends] = useState([]);
    const [token, setToken] = useState(null);
    const [bars, setBars] = useState([]);
    const [popUp, setPopUp] = useState({});

    const fetchSecureStore = async () => {
        try {
            const user = await SecureStore.getItemAsync('currentUser');
            const token = await SecureStore.getItemAsync('token');
            setToken(token.replace(/['"]+/g, ''));
            setUserId(JSON.parse(user).id);
        } catch (error) {
            console.error(error);
        }
    }

    const getUsers = async () => {
        try {
            const response = await fetch(`${api}/users`);
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getFriends = async () => {
        try {
            console.log('token:', token)
            const response = await fetch(`${api}/users/${userId}/friendships`, {
                method: 'GET',
                headers: { Authorization: token }
            });
            const data = await response.json();
            setFriends(data.friendships.map(friend => friend.friend_id));
        } catch (error) {
            console.error(error);
        }
    };

    const getBars = async () => {
        try {
            const response = await fetch(`${api}/bars`);
            const data = await response.json();
            setBars(data.bars);
        } catch (error) {
            console.error(error);
        }
    };

    const togglePopUp = (userId) => {
        setPopUp((prevState) => ({
            ...prevState,
            [userId]: !prevState[userId],
        }));
    };

    const addFriend = async (friendId, barId) => {
        try {
            const payload = barId ? { friend_id: friendId, bar_id: barId } : { friend_id: friendId };
            await fetch(`${api}/users/${userId}/friendships`, {
                method: 'POST',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            setFriends([...friends, friendId]);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUsers();
        getBars();
        fetchSecureStore();
    }, []);

    useEffect(() => {
        if (token && userId) {
            getFriends();
        }
    }, [token, userId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Users</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="Search for a user"
                value={selectedOption}
                onChangeText={text => setSelectedOption(text)}
            />
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <ShowUsers
                    data={users}
                    option={selectedOption}
                    friends={friends}
                    togglePopUp={togglePopUp}
                    popUp={popUp}
                    bars={bars}
                    addFriend={addFriend}
                />
            )}
        </View>
    );
}

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
    userItem: {
        fontSize: 18,
        color: '#F1DCA7',
        fontWeight: '600',
        padding: 10,
    },
    userBox: {
        borderRadius: 10,
        backgroundColor: '#C58100',
        marginBottom: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        paddingRight: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    popUpOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popUpContent: {
        width: '80%',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    popUpTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    barItem: {
        fontSize: 16,
        paddingVertical: 10,
        textAlign: 'center',
        width: '100%',
    },
    noneButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#C58100',
        borderRadius: 5,
    },
    noneButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});
