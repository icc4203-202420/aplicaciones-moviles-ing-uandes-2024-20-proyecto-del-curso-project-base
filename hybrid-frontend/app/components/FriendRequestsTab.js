import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { NGROK_URL } from '@env';

const FriendRequestsScreen = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const userId = await SecureStore.getItemAsync('USER_ID');
        if (userId) {
          const token = await SecureStore.getItemAsync('authToken');
          const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}/friend_requests`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setFriendRequests(response.data.friend_requests || []);
        } else {
          console.error('No user ID found');
        }
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const userId = await SecureStore.getItemAsync('USER_ID');

      if (!userId || !token) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const response = await axios.post(
        `${NGROK_URL}/api/v1/users/${userId}/friend_requests/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', response.data.message);
      setFriendRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'Failed to accept friend request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const userId = await SecureStore.getItemAsync('USER_ID');

      if (!userId || !token) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      await axios.delete(
        `${NGROK_URL}/api/v1/users/${userId}/friend_requests/${requestId}/reject`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', 'Friend request rejected');
      setFriendRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      Alert.alert('Error', 'Failed to reject friend request');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.userText}>{`${item.user.first_name} ${item.user.last_name} (@${item.user.handle})`}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Accept" onPress={() => handleAccept(item.id)} />
              <Button title="Reject" onPress={() => handleReject(item.id)} color="red" />
            </View>
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
  requestItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  userText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FriendRequestsScreen;
