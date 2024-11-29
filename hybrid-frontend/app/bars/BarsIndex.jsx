import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { NGROK_URL } from '@env';

const BarsIndex = () => {
  const [bars, setBars] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get(`${NGROK_URL}/api/v1/bars`)
      .then(response => {
        setBars(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bars:', error);
        setLoading(false);
      });
  }, []);

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (bar.address.line1 && bar.address.line1.toLowerCase().includes(searchText.toLowerCase())) ||
    (bar.address.city && bar.address.city.toLowerCase().includes(searchText.toLowerCase()))
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search bars..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredBars}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('BarsShow', { id: item.id })}>
            <View style={styles.barContainer}>
              <Text style={styles.barName}>{item.name}</Text>
              <Text style={styles.barAddress}>{item.address.line1}, {item.address.city}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noBarsText}>No bars found.</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 24,
    color: 'black',
    paddingRight: 8,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: '500',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  barContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  barName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  barAddress: {
    fontSize: 15,
    color: '#858585',
    marginTop: 4,
  },
  noBarsText: {
    marginTop: 10,
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BarsIndex;
