import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Input, ListItem, Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { NGROK_URL } from '@env';
const BeerSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  console.log("app/beers/");
  useEffect(() => {
    fetchBeers();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      fetchBeers(); // Fetch all beers if search query is cleared
    } else {
      fetchBeers();
    }
  }, [searchQuery]);

  const fetchBeers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${NGROK_URL}/api/v1/beers?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Error fetching beers. Status: ' + response.status);
      }

      const data = await response.json();

      if (!data.beers || !Array.isArray(data.beers)) {
        setBeers([]);
        return;
      }

      setBeers(data.beers);
    } catch (error) {
      setBeers([]);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => router.back()} buttonStyle={styles.backButton} />
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
