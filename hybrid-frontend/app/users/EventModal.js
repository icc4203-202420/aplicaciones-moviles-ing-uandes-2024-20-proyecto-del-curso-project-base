import React, { useState, useEffect } from 'react'; 
import { View, Modal, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { Input, Icon } from '@rneui/themed';
import axios from 'axios';
import { NGROK_URL } from '@env';
import * as Notifications from 'expo-notifications'; 
import * as SecureStore from 'expo-secure-store'; 
import { Alert } from 'react-native'; 

const EventModal = ({ visible, onClose, friendId }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

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

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!friendId) return;
    setLoading(true);
    try {
        const token = await SecureStore.getItemAsync('authToken');
        const userId = await SecureStore.getItemAsync('USER_ID');
        if (!token || !userId) {
            console.error('Missing authentication token or user ID');
            Alert.alert('Error', 'Authentication error. Please log in again.');
            return;
        }
        
        const requestBody = {
            friendship: {
                friend_id: friendId,
                ...(selectedEvent ? { event_id: selectedEvent.id } : {})
            },
        };

        const response = await axios.post(`${NGROK_URL}/api/v1/users/${userId}/friendships`, requestBody, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        console.log('Friend request response:', response.data);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Friend Request Sent',
                body: 'The friend request was sent successfully!'
            },
            trigger: null,
        });
        Alert.alert('Success', 'The friend request was sent successfully!');
    } catch (error) {
        console.error('Error sending friend request:', error.response ? error.response.data : error.message);
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Error',
                body: 'Could not send the friend request. Please try again.',
            },
            trigger: null,
        });
        Alert.alert('Error', 'Could not send the friend request. Please try again.');
    } finally {
        setLoading(false);
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
          {/* Buscador con estilo modificado */}
          <Input
            placeholder="Search for event..."
            value={searchText}
            onChangeText={setSearchText}
            containerStyle={styles.inputContainer}
            inputContainerStyle={styles.input}
            leftIcon={<Icon name="search" color="#6F4E37" />}
            placeholderTextColor="#6F4E37"
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderColor: '#A67B5B',
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#A67B5B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#A67B5B',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#A67B5B',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 10,
  },
});

export default EventModal;
