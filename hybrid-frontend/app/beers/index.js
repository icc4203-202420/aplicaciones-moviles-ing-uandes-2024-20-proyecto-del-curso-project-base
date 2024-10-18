import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Input, ListItem, Button } from '@rneui/themed';
import { useRouter } from 'expo-router';

const BeerSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch beers initially when the component mounts
    fetchBeers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchBeers();
    } else if (searchQuery === '') {
      // Fetch all beers if search query is cleared
      fetchBeers();
    }
  }, [searchQuery]);

  const fetchBeers = async () => {
    setLoading(true);
    try {
      console.log('Fetching beers with query:', searchQuery);
      const response = await fetch(`http://192.168.4.179:3000/api/v1/beers?query=${searchQuery}`);

      if (!response.ok) {
        throw new Error('Error fetching beers. Status: ' + response.status);
      }

      const data = await response.json();

      if (!data.beers || !Array.isArray(data.beers)) {
        console.error('Unexpected data format:', data);
        setBeers([]);
        return;
      }

      setBeers(data.beers);
      console.log('Beers fetched:', data.beers);
    } catch (error) {
      console.error('Error fetching beers:', error);
      setBeers([]);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => router.back()} style={styles.backButton} />
      <Input
        placeholder="Search for a beer"
        value={searchQuery}
        onChangeText={setSearchQuery}
        containerStyle={styles.input}
      />
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      <FlatList
        data={beers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem onPress={() => router.push(`/beers/${item.id}`)}>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.style}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
        ListEmptyComponent={!loading && <Text style={styles.emptyText}>No beers found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default BeerSearchScreen;
