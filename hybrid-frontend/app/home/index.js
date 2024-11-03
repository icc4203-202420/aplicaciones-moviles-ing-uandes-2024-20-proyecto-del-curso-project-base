import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const router = useRouter();
  console.log("app/home");
  console.log("HomeScreen component loaded"); // Log to verify component loading

  const handleLogout = async () => {
    try {
      // Remove the token from storage
      await AsyncStorage.removeItem('authToken');
      console.log('Token removed, logging out');

      // Redirect the user to the login screen
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Could not log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen</Text>
      <Link href="/beers" style={styles.link}>
        <Text>Beer</Text> {/* Ensure this text is inside a <Text> component */}
      </Link>
      <Link href="/users" style={styles.link}>
        <Text>Users</Text> {/* Ensure this text is inside a <Text> component */}
      </Link>
      <Button title="Logout" onPress={handleLogout} buttonStyle={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
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
