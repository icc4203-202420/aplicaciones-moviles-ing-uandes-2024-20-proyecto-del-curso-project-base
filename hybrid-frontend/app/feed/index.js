import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import FeedItem from './FeedItem';
import createCable, { subscribeToFeed } from '../services/WebSocket';
import * as SecureStore from 'expo-secure-store';
import BackButton from '../components/BackButton';
const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const router = useRouter(); // Hook de router

  useEffect(() => {
    const getTokenAndUserId = async () => {
      try {
        const storedAuthToken = await SecureStore.getItemAsync('authToken');
        const storedUserId = await SecureStore.getItemAsync('USER_ID');
        setAuthToken(storedAuthToken);
        setUserId(storedUserId);

        if (storedAuthToken) {
          const cable = createCable(storedAuthToken);
          const subscription = subscribeToFeed(cable, (data) => {
            setPosts((prevPosts) => [data, ...prevPosts]);
          });

          return () => subscription.unsubscribe();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    getTokenAndUserId();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <BackButton/>

      <FlatList
        data={posts}
        renderItem={({ item }) => <FeedItem post={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Feed;
