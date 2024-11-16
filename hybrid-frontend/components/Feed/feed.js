import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../Hooks/fetchAxios';

const Feed = () => {
  const [friendships, setFriendships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(1); // Example current user ID

  useEffect(() => {
    fetchAcceptedFriendships();
  }, []);

  const fetchAcceptedFriendships = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/friendships`);
      console.log('API Response:', response.data); // Debug API response

      if (response.status === 200) {
        // Filter friendships with status 'accepted' and where the current user is involved
        const userFriendships = response.data.filter((friendship) => {
          const isAccepted = friendship.status === 'accepted';
          const isUserInvolved =
            friendship.user_id === currentUserId || friendship.friend_id === currentUserId;

          return isAccepted && isUserInvolved;
        });

        console.log('Filtered Friendships:', userFriendships); // Debug filtered results
        setFriendships(userFriendships);
      } else {
        setError('Failed to fetch friendships.');
      }
    } catch (error) {
      console.error('Error fetching friendships:', error);
      setError('Error fetching friendships, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Accepted Friendships</Text>
      <FlatList
        data={friendships}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendshipContainer}>
            <Text style={styles.name}>
              {item.user.first_name} {item.user.last_name} (@{item.user.handle})
            </Text>
            <Text style={styles.details}>
              Friendship accepted on: {new Date(item.updated_at).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  friendshipContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default Feed;
