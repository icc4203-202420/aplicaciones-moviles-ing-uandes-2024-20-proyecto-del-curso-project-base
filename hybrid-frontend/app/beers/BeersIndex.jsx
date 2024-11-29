import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import BeersIndexCard from './BeersIndexCard';
import { NGROK_URL } from '@env';

const BeersIndex = () => {
  const [beers, setBeers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${NGROK_URL}/api/v1/beers`)  // Cambiar IP Local: 192.168.1.30
      .then(response => {
        setBeers(response.data.beers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching beers:', error);
        setLoading(false);
      });
  }, []);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchText.toLowerCase()) ||
    beer.style.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search beers..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredBeers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BeersIndexCard beer={item} />}
        ListEmptyComponent={<Text style={styles.noBeers}>No beers found.</Text>}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false} 
        scrollEventThrottle={16} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  noBeers: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BeersIndex;