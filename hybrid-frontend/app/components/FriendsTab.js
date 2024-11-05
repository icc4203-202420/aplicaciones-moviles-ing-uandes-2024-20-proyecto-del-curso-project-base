import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { NGROK_URL } from '@env';

const FriendsTab = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    try {
      const userId = await SecureStore.getItemAsync('USER_ID'); // Obtén el ID del usuario
      const token = await SecureStore.getItemAsync('authToken'); // Obtén el token de Secure Store

      if (!userId || !token) {
        console.error('User ID or token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}/friendships`, {
        headers: { 'Authorization': `Bearer ${token}` }, // Incluye el token en la cabecera
      });

      if (response.status === 200) {
        setFriends(response.data); // Ajusta esto según la estructura de tu respuesta
        console.log('Friends data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.friendContainer}>
              <Text style={styles.name}>{`${item.first_name} ${item.last_name}`}</Text>
              <Text style={styles.handle}>@{item.handle}</Text>
            </View>
          )}
        />
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
  container: {
    flex: 1,
    padding: 20,
  },
  friendContainer: {
    width: Dimensions.get('window').width - 40, // Ancho total de la pantalla menos padding
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
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
