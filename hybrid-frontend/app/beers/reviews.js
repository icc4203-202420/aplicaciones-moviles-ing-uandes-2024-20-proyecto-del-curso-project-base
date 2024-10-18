// app/beers/reviews.js
import React, { useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage para obtener el token
import { IP } from '@env';
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

  useEffect(() => {
    const fetchReviews = async () => {
      dispatch({ type: 'LOADING' });
      try {
        const token = await AsyncStorage.getItem('authToken'); // Obtiene el token de autenticación
        const response = await fetch(`http://${IP}:3000/api/v1/beers/${beerId}/reviews`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Incluye el token en los encabezados de la solicitud
          },
        });
        if (!response.ok) {
          throw new Error('Error fetching reviews. Status: ' + response.status);
        }
        const data = await response.json();
        dispatch({ type: 'SUCCESS', payload: { reviews: data.reviews, averageRating: data.averageRating } });
      } catch (error) {
        dispatch({ type: 'ERROR', payload: error.message });
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
      <Text style={styles.averageRating}>Promedio de Calificación: {state.averageRating || 'N/A'}</Text>
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
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Reviews;
