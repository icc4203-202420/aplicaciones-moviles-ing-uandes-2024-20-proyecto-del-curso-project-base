import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BeersIndexCard = ({ beer }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
        onPress={() => navigation.navigate('BeersShow', { id: beer.id })} 
        style={styles.card}
    >
      <View style={styles.content}>
        <Text style={styles.name}>{beer.name}</Text>
        <Text style={styles.secondaryText}>
          {beer.beer_type} - {beer.style} — Alcohol: {beer.alcohol} | {beer.ibu} | Rating: {parseFloat(beer.avg_rating).toFixed(2) || "N/A"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default BeersIndexCard;