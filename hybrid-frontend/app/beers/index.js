// beer list
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Input, Button, ListItem } from '@rneui/themed';

const BeerSearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      fetchBeers();
    }
  }, [searchQuery]);

  const fetchBeers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`YOUR_BACKEND_URL/beers?query=${searchQuery}`);
      const data = await response.json();
      setBeers(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <View>
      <Input
        placeholder="Search for a beer"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading && <Text>Loading...</Text>}
      <FlatList
        data={beers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem onPress={() => navigation.navigate('/beer/detail', { beerId: item.id })}>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.brewery}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      />
    </View>
  );
};

export default BeerSearchScreen;
