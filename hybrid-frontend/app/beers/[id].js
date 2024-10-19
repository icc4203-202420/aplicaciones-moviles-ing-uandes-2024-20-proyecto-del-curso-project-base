import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Button } from '@rneui/themed';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ReviewForm from './reviewForm';
import Reviews from './reviews';
import { NGROK_URL } from '@env';

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
      const response = await fetch(`${NGROK_URL}/api/v1/beers/${id}`);

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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{beer.name || 'No name available'}</Text>
      <Text style={styles.detail}>Style: {beer.style || 'N/A'}</Text>
      <Text style={styles.detail}>Alcohol: {beer.alcohol || 'N/A'}</Text>
      <Text style={styles.detail}>IBU: {beer.ibu || 'N/A'}</Text>
      <Text style={styles.detail}>BLG: {beer.blg || 'N/A'}</Text>
      <Text style={styles.detail}>Yeast: {beer.yeast || 'N/A'}</Text>
      <Text style={styles.detail}>Hop: {beer.hop || 'N/A'}</Text>
      <Text style={styles.detail}>Malts: {beer.malts || 'N/A'}</Text>

      <View style={styles.barsContainer}>
        <Text style={styles.barsTitle}>Bares que sirven esta cerveza</Text>
        {beer.bar_names && beer.bar_names.length > 0 ? (
          beer.bar_names.map((bar, index) => (
            <Text key={index} style={styles.barName}>{bar}</Text>
          ))
        ) : (
          <Text>No hay bares disponibles para esta cerveza.</Text>
        )}
      </View>
      
      <Text style={styles.title}>Rating</Text>
      <ReviewForm beerId={id} onSubmit={handleReviewSubmit} />
      <Reviews beerId={id} beer={beer}/>
      <Button title="Back" onPress={() => router.back()} buttonStyle={styles.backButton} />
    </ScrollView>
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
  barsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  barsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  barName: {
    fontSize: 16,
    marginBottom: 5,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
  },
});

export default BeerDetailsScreen;
