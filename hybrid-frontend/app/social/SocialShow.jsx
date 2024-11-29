import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Avatar, Button, Icon } from 'react-native-elements';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { NGROK_URL } from '@env';

export default function SocialShow() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchUserIdAndFriendshipData = async () => {
    const storedUserId = await SecureStore.getItemAsync('CURRENT_USER_ID');
    if (storedUserId) {
        setCurrentUserId(storedUserId);
        loadFriendshipData(storedUserId);
    }
    };
    fetchUserIdAndFriendshipData();
  }, [id]);

  const loadFriendshipData = async (userId) => {
    if (userId) {
    const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}/friendships/${id}`);
    setIsFriend(response.data.is_friend);
    const eventId = response.data.friendship ? response.data.friendship.event_id : null;
    if (eventId && events.length > 0) {
        const selected = events.find(event => event.id === eventId);
        setSelectedEvent(selected || null);
        setSearchText(selected ? selected.name : '');
    }
    }
  };

  useEffect(() => {
    if (currentUserId && events.length > 0) {
      loadFriendshipData(currentUserId);
    }
  }, [currentUserId, events]);

  useEffect(() => {
    axios.get(`${NGROK_URL}/api/v1/users/${id}`)
      .then(response => setUser(response.data.user))
  }, [id]);

  useEffect(() => {
    axios.get(`${NGROK_URL}/api/v1/events/all_events`)
      .then(response => setEvents(response.data))
  }, []);

  const handleAddFriend = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      await axios.post(`${NGROK_URL}/api/v1/users/${currentUserId}/friendships`, {
        friendship: { friend_id: id, event_id: selectedEvent ? selectedEvent.id : null },
      });
      setIsFriend(true);
      loadFriendshipData(currentUserId);
    } catch (error) {
      console.error('Error adding friend:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = async (event) => {
    if (!currentUserId || !id) {
      console.error("User ID or Friend ID missing");
      return;
    }

    setSelectedEvent(event);
    setSearchText(event.name);
    setSearchResults([]);

    await axios.patch(`${NGROK_URL}/api/v1/users/${currentUserId}/friendships/${id}`, {
        friendship: { event_id: event.id },
    });
    loadFriendshipData(currentUserId);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setSearchResults([]);
    } else {
      const filtered = events.filter(event =>
        event.name.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  if (!user) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" type="material" color="black" />
        </TouchableOpacity>
        <Text style={styles.username}>@{user.handle}</Text>
      </View>

      <View style={styles.card}>
        <Avatar
          size="large"
          rounded
          title={user.first_name ? user.first_name[0] : user.handle[0]}
          containerStyle={styles.avatar}
        />
        <Text style={styles.name}>
          {user.first_name ? `${user.first_name} ${user.last_name}` : user.handle}
        </Text>
        <Text style={styles.friendCount}>53 Friends • 27 mutual</Text>

        {!isFriend ? (
          <Button
            title={loading ? <ActivityIndicator size="small" color="#FFF" /> : "+ ADD FRIEND"}
            buttonStyle={styles.addButton}
            onPress={handleAddFriend}
            disabled={loading}
          />
        ) : (
          <View style={styles.friendButtons}>
            <Button
              title="Friends"
              buttonStyle={styles.addButton}
              icon={<Icon name="check" size={20} color="white" />}
            />
            <Button
              title="Remove"
              buttonStyle={styles.addButton}
              icon={<Icon name="clear" size={20} color="white" />}
            />
          </View>
        )}
      </View>

      <View style={styles.eventContainer}>
        <Text style={styles.eventLabel}>HOW YOU MET:</Text>
        <TextInput
          style={styles.eventInput}
          placeholder="Search event..."
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText && searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleEventSelect(item)}>
                <Text style={styles.eventOption}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  card: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 15,
    backgroundColor: '#FF8603',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  friendCount: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#FF8603',
    marginTop: 15,
    marginStart: 10,
    width: '90%',
    paddingVertical: 10,
  },
  friendButtons: {
    flexDirection: 'row',
    marginTop: 15,
    marginEnd: 105,
    width: '60%',
  },
  friendButton: {
    backgroundColor: '#FF8603',
    flex: 1,
    marginRight: 5,
  },
  removeButton: {
    backgroundColor: '#FF8603',
    flex: 1,
    marginLeft: 5,
  },
  eventContainer: {
    marginTop: 20,
  },
  eventLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  eventInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
    backgroundColor: '#fff',
  },
  eventOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontSize: 16,
    color: '#333',
  },
});
