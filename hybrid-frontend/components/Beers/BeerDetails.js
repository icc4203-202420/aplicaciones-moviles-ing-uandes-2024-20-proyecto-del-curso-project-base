import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../Hooks/fetchAxios';

function BeerDetails({ route, user }) {
  const { beerId } = route.params;
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchBeerDetails();
    fetchReviews(); // Fetch reviews when the component mounts
  }, []);

  const fetchBeerDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/beers/${beerId}`);
      if (response.status !== 200) {
        throw new Error('Error fetching beer details');
      }
      setBeer(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching beer details:', error);
      setError('Error fetching beer details, please try again later.');
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews`);
      if (response.status === 200) {
        console.log('Reviews fetched:', response.data); // Log the response to verify
        const filteredReviews = response.data.reviews.filter(review => review.beer_id === beerId);
        setReviews(filteredReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Error fetching reviews, please try again later.');
    }
  };

  const makeReview = async () => {
    if (!comment || rating <= 0) {
      alert('Please provide a valid comment and rating.');
      return;
    }

    try {
      console.log('Submitting review for user:', user.id); // Log user ID for debugging
      const response = await axios.post(`${API_BASE_URL}/users/${user.id}/reviews`, {
        review: {
          text: comment,
          rating: rating.toString(), // Ensure rating is a string
          beer_id: beerId,
        },
      });

      if (response.status === 201) {
        alert('Review submitted successfully!');
        setComment(''); // Clear comment input
        setRating(0);   // Reset rating
        fetchReviews(); // Refresh the reviews list
      } else {
        alert('Error submitting review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
    return (totalRating / reviews.length).toFixed(1); // Round to one decimal place
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f9a825" />
        <Text>Cargando detalles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!beer) {
    return <Text>No se encontraron detalles de la cerveza.</Text>;
  }

  const averageRating = calculateAverageRating(); // Calculate average rating

  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.container}>
        <Text style={styles.beerName}>{beer.name}</Text>

        {/* Beer Details */}
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Estilo: </Text>
          <Text style={styles.info}>{beer.style || 'No disponible'}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Lúpulo: </Text>
          <Text style={styles.info}>{beer.hop || 'No disponible'}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Levadura: </Text>
          <Text style={styles.info}>{beer.yeast || 'No disponible'}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Malta: </Text>
          <Text style={styles.info}>{beer.malts || 'No disponible'}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>IBU: </Text>
          <Text style={styles.info}>{beer.ibu || 'No disponible'}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>BLG: </Text>
          <Text style={styles.info}>{beer.blg || 'No disponible'}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Alcohol: </Text>
          <Text style={styles.info}>{beer.alcohol || 'No disponible'}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.label}>Cervecería: </Text>
          <Text style={styles.info}>{beer.brand?.brewery?.name || 'No disponible'}</Text>
        </View>

        {/* Bars serving the beer */}
        <View style={styles.barsContainer}>
          <Text style={styles.label}>Bares que sirven esta cerveza:</Text>
          {beer.bars && beer.bars.length > 0 ? (
            beer.bars.map(bar => (
              <Text key={bar.id} style={styles.barName}>{bar.name}</Text>
            ))
          ) : (
            <Text style={styles.info}>No disponible</Text>
          )}
        </View>

        {/* Review Submission */}
        <View style={styles.reviewContainer}>
          <Text style={styles.label}>Deja tu comentario:</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu comentario aquí..."
            value={comment}
            onChangeText={setComment}
          />
          <TextInput
            style={styles.input}
            placeholder="Rating (1-5)"
            keyboardType="numeric"
            value={rating.toString()}
            onChangeText={(text) => setRating(Number(text))}
          />
          <Button title="Enviar Comentario" onPress={makeReview} />
        </View>

        {/* Display Reviews */}
        <Text style={styles.label}>Comentarios:</Text>
        {reviews.length > 0 ? (
          <FlatList
            data={reviews}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <Text style={styles.reviewRating}>{item.rating} Estrellas</Text>
                <Text style={styles.reviewText}>{item.text}</Text>
                <Text style={styles.reviewUser}>Por: {item.user_id}</Text>
                <Text style={styles.reviewDate}>{new Date(item.created_at).toLocaleString()}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text>No hay comentarios aún.</Text>
        )}

        {/* Display Average Rating */}
        <Text style={styles.averageRating}>Calificación promedio: {averageRating} Estrellas</Text>
      </View>
    </ScrollView>  
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF', // Neutral background for main container
    borderRadius: 10,
    margin: 20,
    borderColor: '#FFDE7D', // Subtle border color to match theme
    borderWidth: 1,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: '#f9a825', // Light background with warm color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFDE7D', // Light background with warm color
  },
  errorText: {
    color: '#D32F2F', // Red for error messages
    fontSize: 18,
    textAlign: 'center',
  },
  beerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFA726', // Warm accent color for headings
    marginBottom: 10,
    textAlign: 'center',
  },
  detailContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333333', // Dark color for labels
  },
  info: {
    fontSize: 16,
    color: '#555555', // Medium-dark gray for descriptive text
  },
  barsContainer: {
    marginTop: 20,
  },
  barName: {
    fontSize: 16,
    paddingLeft: 20,
    color: '#6A1B9A', // Purple accent for bar names
    marginBottom: 5,
  },
  reviewContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD', // Gray border for inputs
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#F5F5F5', // Light background for inputs
  },
  reviewCard: {
    padding: 10,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#FAFAFA', // Light gray for review cards
  },
  reviewRating: {
    fontWeight: 'bold',
    color: '#FFA726', // Accent color for ratings
  },
  reviewText: {
    marginVertical: 5,
    color: '#333333',
  },
  reviewUser: {
    fontStyle: 'italic',
    color: '#757575', // Dark gray for usernames
    marginBottom: 5,
  },
  reviewDate: {
    fontSize: 12,
    color: '#757575',
  },
  averageRating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#388E3C', // Green for average rating
  },
});


export default BeerDetails;
