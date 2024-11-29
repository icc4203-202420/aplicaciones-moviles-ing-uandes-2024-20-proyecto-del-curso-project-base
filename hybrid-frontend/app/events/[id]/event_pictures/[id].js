// /events/[event_id]/event_picture/[id].js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { NGROK_URL } from '@env';
import BackButton from '../../../components/BackButton'; 
const EventPictureDetail = () => {
  const { event_id, id } = useLocalSearchParams(); 
  const [pictureDetails, setPictureDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPictureDetails = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/events/${event_id}/event_pictures/${id}`);
        setPictureDetails(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching picture details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPictureDetails();
  }, [event_id, id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Image Details</Text>
      <Image 
        source={{ uri: `${NGROK_URL}${pictureDetails.image_url}` }} 
        style={styles.image}
      />
      <Text style={styles.description}>{pictureDetails.description || 'No description available'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16},
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  image: { width: '100%', height: 300, marginBottom: 10 },
  description: { fontSize: 16, color: 'gray' },
});

export default EventPictureDetail;
