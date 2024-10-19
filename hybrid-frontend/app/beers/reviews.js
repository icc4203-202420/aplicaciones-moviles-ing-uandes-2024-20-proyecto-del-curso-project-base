// app/beers/reviews.js
import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage para obtener el token
import axios from 'axios'; // Importa axios
import { NGROK_URL } from '@env';

const initialState = {
  loading: true,
  error: '',
  reviews: [],
  averageRating: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'SUCCESS':
      return {
        ...state,
        loading: false,
        reviews: action.payload.reviews,
        averageRating: action.payload.averageRating,
      };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Reviews = ({ beerId }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log("REVIEWS rendered");
  useEffect(() => {
    const fetchReviews = async () => {
      dispatch({ type: 'LOADING' });
      try {
        const token = await AsyncStorage.getItem('authToken'); // Obtiene el token de autenticación
        console.log("REVIEWS TOKEN:", token);
        const response = await axios.get(`${NGROK_URL}/api/v1/beers/${beerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Incluye el token en los encabezados de la solicitud
          },
        });
        console.log('Beer details response:', response.data);
        dispatch({ type: 'SUCCESS', payload: { reviews: response.data.reviews || [], averageRating: response.data.averageRating } });
      } catch (error) {
        dispatch({ type: 'ERROR', payload: error.message });
        console.log(error.message);
      }
    };
    fetchReviews();
  }, [beerId]);

  if (state.loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (state.error) {
    return <Text style={styles.error}>{state.error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.averageRating}>Average Rating: {state.averageRating || 'N/A'}</Text>
      {state.reviews.length === 0 ? (
        <Text style={styles.noReviews}>No hay reseñas para esta cerveza todavía.</Text>
      ) : (
        <FlatList
          data={state.reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewContainer}>
              <Text style={styles.reviewText}>{item.text}</Text>
              <Text style={styles.reviewRating}>Calificación: {item.rating}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.noReviews}>No hay evaluaciones.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  averageRating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewContainer: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  reviewText: {
    fontSize: 16,
  },
  reviewRating: {
    fontSize: 14,
    color: 'gray',
  },
  noReviews: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
    fontSize: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Reviews;
