import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const BeerDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchBeerDetails();
    }
  }, [id]);

  const fetchBeerDetails = async () => {
    try {
      console.log('Fetching beer details for ID:', id); // Depuración
      const response = await fetch(`http://192.168.4.179:3000/api/v1/beers/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching beer details. Status: ' + response.status);
      }
      const data = await response.json();
      console.log('Beer details fetched:', data); // Depuración
      setBeer(data.beer); // Accede al objeto 'beer' en la respuesta
    } catch (error) {
      console.error('Error fetching beer details:', error);
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!beer) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Beer not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{beer.name || 'No name available'}</Text>
      <Text style={styles.detail}>Style: {beer.style || 'N/A'}</Text>
      <Text style={styles.detail}>Alcohol: {beer.alcohol || 'N/A'}</Text>
      <Text style={styles.detail}>IBU: {beer.ibu || 'N/A'}</Text>
      <Text style={styles.detail}>BLG: {beer.blg || 'N/A'}</Text>
      <Text style={styles.detail}>Yeast: {beer.yeast || 'N/A'}</Text>
      <Text style={styles.detail}>Hop: {beer.hop || 'N/A'}</Text>
      <Text style={styles.detail}>Malts: {beer.malts || 'N/A'}</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 5,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default BeerDetailsScreen;
