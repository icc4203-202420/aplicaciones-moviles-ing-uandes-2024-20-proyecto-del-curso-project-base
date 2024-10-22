// src/components/UserSearch.jsx
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { NGROK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const UserSearch = () => {
  const [handle, setHandle] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  const searchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${NGROK_URL}/api/v1/users`, {
        params: { handle },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setResults(response.data.users);
      setError('');
    } catch (err) {
      setError('Error al buscar el usuario');
    }
  };

  const addFriend = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post(`${NGROK_URL}/api/v1/friendships`, 
        { friend_id: userId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      Alert.alert('Solicitud de amistad enviada');
    } catch (err) {
      setError('Error al agregar amigo');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por handle"
        value={handle}
        onChangeText={setHandle}
      />
      <Button title="Buscar" onPress={searchUser} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.result}>
            <Text>{item.handle}</Text>
            <Button title="Agregar Amigo" onPress={() => addFriend(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>No se encontraron usuarios</Text>}
      />
      <Button title="Back" onPress={() => router.back()} style={styles.backButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  error: { color: 'red', marginTop: 10 },
  result: { marginVertical: 10 },
  backButton: {
    marginTop: 20,
  },
});

export default UserSearch;
