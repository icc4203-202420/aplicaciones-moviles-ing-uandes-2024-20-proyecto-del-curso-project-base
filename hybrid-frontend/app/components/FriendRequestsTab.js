import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { NGROK_URL } from '@env';

const UserScreen = () => {
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserIdAndData = async () => {
      try {
        const userId = await SecureStore.getItemAsync('USER_ID');
        if (userId) {
          fetchUsers();
          fetchFriendRequests(userId);
        } else {
          console.error('No user ID found');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserIdAndData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${NGROK_URL}/api/v1/users`, {
        params: { attended_event: true }
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendRequests = async (userId) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}/friend_requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriendRequests(response.data.friend_requests || []);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const userId = await SecureStore.getItemAsync('USER_ID');

      if (!userId || !token) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const requestBody = {
        friendship: {
          friend_id: friendId,
        },
      };

      await axios.post(`${NGROK_URL}/api/v1/users/${userId}/friendships`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('Success', 'Friend request sent successfully!');
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const filteredUsers = users.filter(user => {
    const handle = user.handle || '';
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase() || '';
    const eventNames = user.events?.map(event => event.name).join(', ').toLowerCase() || '';

    return handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
           fullName.includes(searchTerm.toLowerCase()) ||
           eventNames.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by handle, name or event"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userText}>{`${item.first_name} ${item.last_name} (@${item.handle})`}</Text>
            <Button title="Add Friend" onPress={() => handleAddFriend(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>No users found</Text>}
      />
      <Text style={styles.subtitle}>Friend Requests</Text>
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.userText}>{`${item.user.first_name} ${item.user.last_name} (@${item.user.handle})`}</Text>
            <Button title="Accept" onPress={() => handleAccept(item.id)} />
            <Button title="Reject" onPress={() => handleReject(item.id)} color="red" />
          </View>
        )}
        ListEmptyComponent={<Text>No friend requests</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  requestItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  userText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserScreen;
