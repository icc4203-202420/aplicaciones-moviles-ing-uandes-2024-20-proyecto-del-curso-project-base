import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../Hooks/fetchAxios';

const Feed = () => {
  const [feed, SetFeed] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [friends, setFriends] = useState([]);
  const [beers, setBeers] = useState({});
  const [bars, setBars] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedFilter, setSelectedFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      if (!user) throw new Error('User not found in AsyncStorage');
      setCurrentUser(user);

      const friendsResponse = await axios.get(`${API_BASE_URL}/users/${user.id}/friends`);
      const friendsList = friendsResponse.data;
      setFriends(friendsList);

      const reviewsResponse = await axios.get(`${API_BASE_URL}/reviews`);
      const allReviews = reviewsResponse.data.reviews;
      setReviews(allReviews);

      const beersResponse = await axios.get(`${API_BASE_URL}/beers`);
      const allBeers = beersResponse.data.beers || [];
      const beersMap = allBeers.reduce((map, beer) => {
        map[beer.id] = beer;
        return map;
      }, {});
      setBeers(beersMap);

      const barsResponse = await axios.get(`${API_BASE_URL}/bars`);
      setBars(barsResponse.data.bars);
    } catch (error) {
      console.error('Error fetching feed data:', error);
      setError('Error fetching feed data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const friend = friends.find((friend) => friend.id === review.user_id);
    const beerName = beers[review.beer_id]?.name || 'Desconocida';
    
    if (selectedFilter === 'Amistad' && filterValue) {
      return review.user_id === parseInt(filterValue, 10);
    }
    if (selectedFilter === 'Bar' && filterValue) {
      return review.bar_id === parseInt(filterValue, 10);
    }
    if (selectedFilter === 'Cerveza' && filterValue) {
      return review.beer_id === parseInt(filterValue, 10);
    }

    const friendMatch =
      friend &&
      (friend.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.handle.toLowerCase().includes(searchTerm.toLowerCase()));
    const beerMatch = beerName.toLowerCase().includes(searchTerm.toLowerCase());

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
      <Text style={styles.header}>Actividad de tus amigos</Text>

      <View style={styles.filterContainer}>
        <Picker
          selectedValue={selectedFilter}
          onValueChange={(value) => {
            setSelectedFilter(value);
            setFilterValue('');
          }}
          style={styles.picker}
        >
          <Picker.Item label="Seleccionar filtro" value="" />
          <Picker.Item label="Amistad" value="Amistad" />
          <Picker.Item label="Bar" value="Bar" />
          <Picker.Item label="Cerveza" value="Cerveza" />
          <Picker.Item label="País" value="País" />
        </Picker>

        {selectedFilter === 'Amistad' && (
          <Picker
            selectedValue={filterValue}
            onValueChange={(value) => setFilterValue(value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar amigo" value="" />
            {friends.map((friend) => (
              <Picker.Item key={friend.id} label={`${friend.first_name} ${friend.last_name}`} value={friend.id.toString()} />
            ))}
          </Picker>
        )}
        {selectedFilter === 'Bar' && (
          <Picker
            selectedValue={filterValue}
            onValueChange={(value) => setFilterValue(value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar bar" value="" />
            {bars.map((bar) => (
              <Picker.Item key={bar.id} label={bar.name} value={bar.id.toString()} />
            ))}
          </Picker>
        )}
        {selectedFilter === 'Cerveza' && (
          <Picker
            selectedValue={filterValue}
            onValueChange={(value) => setFilterValue(value)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar cerveza" value="" />
            {Object.values(beers).map((beer) => (
              <Picker.Item key={beer.id} label={beer.name} value={beer.id.toString()} />
            ))}
          </Picker>
        )}
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por amigo o cerveza"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const friend = friends.find((friend) => friend.id === item.user_id);
          const beerName = beers[item.beer_id]?.name || 'Desconocida';

          return (
            <TouchableOpacity onPress={() => navigation.navigate('BeerDetails', { beerId: item.beer_id })}>
              <View style={styles.reviewCard}>
                <Text style={styles.friendName}>
                  {friend?.first_name || 'Amigo'} ({friend?.handle || '@desconocido'})
                </Text>
                <Text style={styles.reviewRating}>{item.rating} Estrellas</Text>
                <Text style={styles.reviewText}>{item.text}</Text>
                <Text style={styles.reviewDate}>{new Date(item.created_at).toLocaleString()}</Text>
                <Text style={styles.reviewBeer}>Cerveza: {beerName}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
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
  filterContainer: {
    marginBottom: 16,
  },
  picker: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 4,
    marginBottom: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#FF6F00',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
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
});

export default Feed;
