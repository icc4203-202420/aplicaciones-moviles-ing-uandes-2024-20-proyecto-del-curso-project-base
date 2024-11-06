import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const HomeScreen = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null); // Inicializa userId en null

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await SecureStore.getItemAsync('USER_ID'); // Obtiene el USER_ID de Secure Store
        setUserId(id); // Establece el userId en el estado
      } catch (error) {
        console.error('Error fetching user ID:', error);
        Alert.alert('Error', 'No se pudo obtener el ID de usuario.');
      }
    };

    fetchUserId(); // Llama a la función para obtener el userId al cargar el componente
  }, []);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken'); // Cambia a Secure Store
      await SecureStore.deleteItemAsync('USER_ID'); // Cambia a Secure Store

      console.log('Token removed, logging out');
      router.push('/'); // Redirige a la pantalla de inicio
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Could not log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen</Text>
      <Link href="/beers" style={styles.link}>
        <Text>Beer</Text>
      </Link>
      <Link href="/users" style={styles.link}>
        <Text>Users</Text>
      </Link>
      <Link href="/events" style={styles.link}>
        <Text>Event</Text>
      </Link>
      {userId && ( // Asegúrate de que userId no es null antes de mostrar el enlace
        <Link href={`/users/${userId}`} style={styles.link}>
          <Text>Your Profile</Text> {/* Enlace al perfil del usuario */}
        </Link>
      )}
      <Button title="Logout" onPress={handleLogout} buttonStyle={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centrar verticalmente
    alignItems: 'center', // Centrar horizontalmente
    padding: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  link: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
