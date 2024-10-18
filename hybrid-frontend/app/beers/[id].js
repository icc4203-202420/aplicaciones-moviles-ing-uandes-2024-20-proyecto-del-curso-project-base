// app/beers/[id].js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ReviewForm from './reviewForm';
import Reviews from './reviews';
import { IP } from '@env';
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
      const response = await fetch(`http://192.168.4.179:3000/api/v1/beers/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching beer details. Status: ' + response.status);
      }
      const data = await response.json();
      setBeer(data.beer);
    } catch (error) {
      console.error('Error fetching beer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (review) => {
    // Aquí puedes implementar la lógica para enviar la evaluación al servidor
    console.log('Enviando evaluación:', review);
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
      <ReviewForm beerId={id} onSubmit={handleReviewSubmit} />
      <Reviews beerId={id} />
      <Button title="Back" onPress={() => router.back()} buttonStyle={styles.backButton} />
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
  },
});

export default BeerDetailsScreen;
