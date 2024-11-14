import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Text } from 'react-native';
import FeedItem from './FeedItem';
import createCable, { subscribeToFeed } from '../../services/WebSocket';
import AuthContext from '../../context/AuthContext';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    const cable = createCable(authToken);
    const subscription = subscribeToFeed(cable, (data) => {
      setPosts((prevPosts) => [data, ...prevPosts]);
    });

    return () => subscription.unsubscribe();
  }, [authToken]);

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
