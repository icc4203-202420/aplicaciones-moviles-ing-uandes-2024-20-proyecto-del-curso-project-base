import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { NGROK_URL } from '@env';

const FriendRequestsTab = ({ userId }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}/friend-requests`);
      if (response.status === 200) {
        setFriendRequests(response.data); // Almacena las solicitudes de amistad en el estado
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      setLoading(true);
      const response = await axios.post(`${NGROK_URL}/api/v1/users/${userId}/friend_requests/${requestId}/accept`);
      Alert.alert('Success', response.data.message);
      fetchFriendRequests(); // Actualiza la lista de solicitudes de amistad
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', error.response?.data?.error || 'Error accepting friend request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setLoading(true);
      await axios.delete(`${NGROK_URL}/api/v1/users/${userId}/friend_requests/${requestId}/reject`);
      Alert.alert('Success', 'Friend request rejected!');
      fetchFriendRequests(); // Actualiza la lista de solicitudes de amistad
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      Alert.alert('Error', 'Error rejecting friend request');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      {friendRequests.length > 0 ? (
        friendRequests.map((request) => (
          <View key={request.id} style={styles.requestContainer}>
            <Text style={styles.text}>{`${request.user.first_name} ${request.user.last_name} (@${request.user.handle})`}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Accept" onPress={() => handleAccept(request.id)} />
              <Button title="Reject" onPress={() => handleReject(request.id)} color="red" />
            </View>
          </View>
        ))
      ) : (
        <Text>No tienes solicitudes de amistad.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default FriendRequestsTab;
