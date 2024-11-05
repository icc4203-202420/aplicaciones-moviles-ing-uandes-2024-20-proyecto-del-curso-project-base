import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { NGROK_URL } from '@env';

const FriendsTab = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken'); // Obtén el token de Secure Store
      console.log('TOKEN: ',token);
      const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}/friendships`, {
        headers: { 'Authorization': `Bearer ${token}` }, // Incluye el token en la cabecera
      });
      if (response.status === 200) {
        setFriends(response.data); 
        console.log(response.data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
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
      {friends.length > 0 ? (
        friends.map((friend) => (
          <View key={friend.id} style={styles.friendContainer}>
            <Image
              source={{ uri: friend.avatar_url || '/default-avatar.png' }}
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{`${friend.first_name} ${friend.last_name}`}</Text>
              <Text style={styles.handle}>@{friend.handle}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text>No friends yet. Try adding some friends.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  handle: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
  },
});

export default FriendsTab;
