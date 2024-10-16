import React from 'react';
import { View, Text, Button } from '@rneui/themed';
import { Link } from 'expo-router';

const HomeScreen = () => {
  return (
    <View>
      <Text>Welcome to the Home Screen</Text>
      <Link href="/beer/search">Go to Beer Search</Link>
      <Button title="Logout" onPress={() => { /* handle logout */ }} />
    </View>
  );
};

export default HomeScreen;
