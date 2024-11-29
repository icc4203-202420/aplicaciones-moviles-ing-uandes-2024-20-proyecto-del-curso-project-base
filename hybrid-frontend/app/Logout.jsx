import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Usar SecureStore
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NGROK_URL } from '@env';

const Logout = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
  const JWT_TOKEN = await SecureStore.getItemAsync('JWT_TOKEN');

  if (!JWT_TOKEN) {
    Alert.alert('Error', 'No token found, please log in again.');
    return;
  }

  await axios.delete(`${NGROK_URL}/api/v1/logout`, {
    headers: { Authorization: `${JWT_TOKEN}` },
  });

  await SecureStore.deleteItemAsync('JWT_TOKEN');
  await SecureStore.deleteItemAsync('CURRENT_USER_ID');

  Alert.alert('Logged out successfully!');
  navigation.navigate('Login'); 
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Out</Text>
      <Text style={styles.subtitle}>Are you sure you want to log out?</Text>
      <Button title="Log Out" onPress={handleLogout} color="#FF8603" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Logout;