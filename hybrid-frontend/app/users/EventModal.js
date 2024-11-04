import React, { useState, useEffect } from 'react'; 
import { View, Modal, StyleSheet, Text, TouchableOpacity, Button, FlatList } from 'react-native';
import { Input, Icon } from '@rneui/themed';
import axios from 'axios';
import { NGROK_URL } from '@env';
import * as Notifications from 'expo-notifications'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const EventModal = ({ visible, onClose, friendId }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/events`);
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (visible) {
      setSelectedEvent(null);
      setSearchText('');
    }
  }, [visible]);

  useEffect(() => {
    const receivedListener = Notifications.addNotificationReceivedListener(async (notification) => {
      const { title, body , data } = notification.request.content;
      console.log('Notification received: ', title, body, data);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received: ', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(receivedListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []); 

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('USER_ID');

      const requestBody = {
        friendship: {
          friend_id: friendId,
          bar_id: selectedEvent?.id,
        },
      };

      await axios.post(`${NGROK_URL}/api/v1/users/${userId}/friendships`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Friend Request Sent',
          body: 'The friend request was sent successfully!'
        },
        trigger: null,
      });
      Alert.alert('Success', 'The friend request was sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Error',
          body: 'Could not send the friend request. Please try again.',
        },
        trigger: null,
      });
      Alert.alert('Error', 'Could not send the friend request. Please try again.');
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Event</Text>
          <Input
            placeholder="Search for event..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.eventItem}
                onPress={() => setSelectedEvent(item)}
              >
                <Text style={styles.eventText}>{item.name}</Text>
                {selectedEvent && selectedEvent.id === item.id && (
                  <Icon name="check" size={20} color="green" />
                )}
              </TouchableOpacity>
            )}
          />
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventText: {
    fontSize: 16,
  },
});

export default EventModal;
