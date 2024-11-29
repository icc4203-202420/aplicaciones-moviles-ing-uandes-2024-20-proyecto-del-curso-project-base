import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import SocialSearch from './SocialSearch';
import pintpalLogo from '../../assets/pintpal-logo.png';
import { useNavigation } from '@react-navigation/native';

export default function SocialIndex() {
  const navigation = useNavigation();

  const handleBackClick = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackClick}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>PintPal</Text>
        <Image source={pintpalLogo} style={styles.logo} />
      </View>
      <SocialSearch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 20,
  },
  backButton: {
    fontSize: 24,
    color: 'black',
    marginLeft: '-20%',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: 'black',
  },
  logo: {
    width: 50,
    height: 50,
  },
});
