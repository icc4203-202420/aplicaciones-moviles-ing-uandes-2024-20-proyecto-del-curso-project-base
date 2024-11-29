import React from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation, setIsAuthenticated, setUser, user }) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user'); // Clear user data from AsyncStorage
      setUser(null); // Reset user state
      setIsAuthenticated(false); // Logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Home, {user?.first_name || 'User'}!</Text>

      <Pressable style={styles.button} onPress={() => navigation.navigate('BeerList')}>
        <Text style={styles.buttonText}>Buscar Cerveza</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate('FriendDetails')}>
        <Text style={styles.buttonText}>Amigos</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate('BarsList')}>
        <Text style={styles.buttonText}>Bares</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate('EventsList')}>
        <Text style={styles.buttonText}>Eventos</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => navigation.navigate('Feed')}>
        <Text style={styles.buttonText}>Feed</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9a825',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#a68300',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    width: '80%',
  },
  logoutButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
