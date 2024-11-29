import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import barsHomeImage from '../../assets/bars_home.png';
import axios from 'axios';
import { NGROK_URL } from '@env';

const BarsShow = () => {
  const [bar, setBar] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    axios.get(`${NGROK_URL}/api/v1/bars/${id}`)
      .then(response => {
        setBar(response.data.bar);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bar:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (!bar) {
    return <Text style={styles.noDataText}>Bar data not available.</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>{'←'}</Text>
      </TouchableOpacity>

      <Text style={styles.barName}>{bar.name}</Text>
      <Text style={styles.barAddress}>{bar.address.line1}, {bar.address.line2}, {bar.address.city}</Text>

      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleText}>18:00 PM - 4:00 AM</Text>
      </View>

      <Image source={barsHomeImage} style={styles.image} />

      <Text style={styles.eventsTitle}>Events</Text>
      <FlatList
        data={bar.events}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item: event }) => (
          <TouchableOpacity onPress={() => navigation.navigate('EventsShow', { id: event.id })} style={styles.eventCard}>
            <Text style={styles.eventDate}>
              {new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventDescription}>{event.description}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noEventsText}>No events available.</Text>}
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
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 24,
    color: 'black',
  },
  barName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  barAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#888',
    marginBottom: 20,
  },
  scheduleText: {
    fontSize: 14,
    color: '#888',
  },
  barImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  noEventsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  }
});

export default BarsShow;
