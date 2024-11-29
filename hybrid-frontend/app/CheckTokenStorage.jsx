import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const CheckTokenStorage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await SecureStore.getItemAsync('JWT_TOKEN');
      navigation.navigate(token ? 'Home' : 'Login');
    };

    checkAuthentication();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF8603" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckTokenStorage;
