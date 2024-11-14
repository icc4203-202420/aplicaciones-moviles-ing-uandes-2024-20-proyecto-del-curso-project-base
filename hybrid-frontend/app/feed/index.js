import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text } from 'react-native';
import FeedItem from './FeedItem';
import createCable, { subscribeToFeed } from '../services/WebSocket';
import AuthContext from '../context/AuthContext';
import * as SecureStore from 'expo-secure-store';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Obtener authToken y userId desde SecureStore
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
        console.error('Error retrieving token or userId from SecureStore:', error);
      }
    };

    getTokenAndUserId();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <FeedItem post={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Feed;