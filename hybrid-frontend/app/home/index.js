import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import { Link } from 'expo-router';

const HomeScreen = () => {
  console.log("HomeScreen component loaded"); // Log para verificar la carga del componente

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen</Text>
      <Link href="/beers" style={styles.link}>Go to Beer Search</Link>
      <Button title="Logout" onPress={() => { /* handle logout */ }} buttonStyle={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
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
