import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { Input, ListItem, Button, Icon } from '@rneui/themed';
import axios from 'axios';
import { NGROK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import EventModal from './EventModal'; // Importa el modal

const UserSearchScreen = () => {
  const [currentUserId, setCurrentUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUserId = await AsyncStorage.getItem('CURRENT_USER_ID');
      if (storedUserId) {
        setCurrentUserId(storedUserId);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    fetchUsers(); // Fetch all users on component mount
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${NGROK_URL}/api/v1/users`);
      const filteredUsers = response.data.users.filter(user => user.id !== parseInt(currentUserId));
      setUsers(filteredUsers);
      setFilteredUsers(filteredUsers); // Initialize filtered users
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      setUsers([]); // Clear users on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const results = users.filter(user =>
      user.handle.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchText, users]); // Filter whenever searchText or users change

  const handleAddFriend = (userId) => {
    setSelectedFriendId(userId);
    setModalVisible(true); // Show the modal when adding a friend
  };

  const handleModalSubmit = async (event) => {
    if (!currentUserId || !event) return; // Ensure event is selected

    try {
      await axios.post(`${NGROK_URL}/api/v1/users/${currentUserId}/friendships`, {
        friendship: {
          friend_id: selectedFriendId,
          event_id: event.id,
        },
      });
      // Notify friend about the new friendship
      notifyFriend(selectedFriendId);
      alert('Friend request sent successfully!');
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const notifyFriend = async (friendId) => {
    console.log(`Notification sent to friend with ID: ${friendId}`);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Buscar por handle..."
        value={searchText}
        onChangeText={setSearchText}
        containerStyle={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>{item.handle}</ListItem.Title>
                <ListItem.Subtitle>{`${item.first_name} ${item.last_name}`}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron />
              <Button 
                title="" 
                onPress={() => handleAddFriend(item.id)} 
                icon={<Icon name="person-add" color="#ffffff" />}
              />
            </ListItem>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron usuarios.</Text>}
        />
      )}
      {/* Modal para agregar amigos */}
      <EventModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSubmit={handleModalSubmit}
        friendId={selectedFriendId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default UserSearchScreen;
