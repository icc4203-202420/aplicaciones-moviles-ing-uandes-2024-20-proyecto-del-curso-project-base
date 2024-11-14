import React from 'react';
import { View, Text } from 'react-native';

const FeedItem = ({ post }) => (
  <View style={{ padding: 10, borderBottomWidth: 1 }}>
    <Text>{post.content}</Text>
    <Text>{new Date(post.created_at).toLocaleString()}</Text>
  </View>
);

export default FeedItem;