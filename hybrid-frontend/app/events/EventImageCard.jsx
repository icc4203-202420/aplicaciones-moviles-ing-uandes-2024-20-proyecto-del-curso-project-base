import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const EventImageCard = ({ pictureUrl, pictureDescription, userFirstName, userLastName }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: pictureUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.userName}>{userFirstName} {userLastName}</Text>
        <Text style={styles.description}>{pictureDescription}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
});

export default EventImageCard;
