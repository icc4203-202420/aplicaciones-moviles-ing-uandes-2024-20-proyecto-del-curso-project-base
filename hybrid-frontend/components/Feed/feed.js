import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../Hooks/fetchAxios';

const Feed = () => {
  const [reviews, setReviews] = useState([]);
  const [friends, setFriends] = useState([]);
  const [beers, setBeers] = useState({}); // Store beers as an object (beer_id -> beer_name)
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      // Fetch current user from AsyncStorage
      const userData = await AsyncStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      if (!user) throw new Error('User not found in AsyncStorage');
      setCurrentUser(user);

      // Fetch user's friends
      const friendsResponse = await axios.get(`${API_BASE_URL}/users/${user.id}/friends`);
      const friendsList = friendsResponse.data;
      setFriends(friendsList);

      // Fetch all reviews
      const reviewsResponse = await axios.get(`${API_BASE_URL}/reviews`);
      const allReviews = reviewsResponse.data.reviews;
      setReviews(allReviews);

      // Fetch all beers
      const beersResponse = await axios.get(`${API_BASE_URL}/beers`);
      const allBeers = beersResponse.data;

      // Debugging: Log the response to check the structure
      console.log('Beers response:', allBeers);

      if (allBeers && typeof allBeers === 'object') {
        // Assuming beer data is returned as an object with beer_id as keys
        setBeers(allBeers);
      } else {
        console.error('Beers data is not an object:', allBeers);
      }

    } catch (error) {
      console.error('Error fetching feed data:', error);
      setError('Error fetching feed data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
  };

  const filteredReviews = reviews.filter((review) => {
    // Filter reviews by friend's name or handle and beer name
    const friend = friends.find((friend) => friend.id === review.user_id);
    console.log('Friend:', friend);
    const beerId = review.beer_id; // Access the beer_id from the review
    const beerName = 
     // Access the beer name using the beer_id
    console.log('Beer ID:', beerId); // Log the beer ID
    console.log('Beer Name:', beerName); // Log the beer name

    
    
    const friendMatch = friend && (friend.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || friend.handle.toLowerCase().includes(searchTerm.toLowerCase()));
    const beerMatch = beerName && beerName.toLowerCase().includes(searchTerm.toLowerCase());

    return friendMatch || beerMatch;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f9a825" />
        <Text>Cargando feed...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reseñas de tus amigos</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por amigo o cerveza"
        value={searchTerm}
        onChangeText={handleSearchChange}
      />

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <FlatList
          data={filteredReviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const friend = friends.find((friend) => friend.id === item.user_id);
            const beerName = beers[item.beer_id]?.name || 'Desconocida'; // Fetch beer name

            return (
              <View style={styles.reviewCard}>
                <Text style={styles.friendName}>
                  {friend?.first_name || 'Amigo'} ({friend?.handle || '@desconocido'})
                </Text>
                <Text style={styles.reviewRating}>{item.rating} Estrellas</Text>
                <Text style={styles.reviewText}>{item.text}</Text>
                <Text style={styles.reviewDate}>{new Date(item.created_at).toLocaleString()}</Text>
                <Text style={styles.reviewBeer}>
                  Cerveza: {beerName}
                </Text>
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles.noReviewsText}>Tus amigos aún no han publicado reseñas.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8E1',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FF6F00',
  },
  reviewCard: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#FFDE7D',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#6A1B9A',
    marginBottom: 4,
  },
  reviewRating: {
    fontSize: 14,
    color: '#FFA726',
    fontWeight: 'bold',
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'right',
  },
  reviewBeer: {
    fontSize: 14,
    color: '#0288D1',
    marginTop: 8,
  },
  noReviewsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 18,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#FF6F00',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default Feed;
