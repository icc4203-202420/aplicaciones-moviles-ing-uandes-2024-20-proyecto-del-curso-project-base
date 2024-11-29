import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const UsersList = ({ user, isFriend = false }) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{user.first_name ? user.first_name[0] : user.handle[0]}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>
          {user.first_name ? `${user.first_name} ${user.last_name}` : user.handle}
          {isFriend && <FontAwesome name="group" style={styles.friendIcon} />}
        </Text>
        <Text style={styles.handle}>@{user.handle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  avatarContainer: {
    backgroundColor: '#ccc',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    flexDirection: 'row',
    alignItems: 'center',
  },
  handle: {
    fontSize: 14,
    color: 'gray',
  },
  friendIcon: {
    fontSize: 16,
    color: 'orange',
    marginLeft: 5,
  },
});

export default UsersList;
