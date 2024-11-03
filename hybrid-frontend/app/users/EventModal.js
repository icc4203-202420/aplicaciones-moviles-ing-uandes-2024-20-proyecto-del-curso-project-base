import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Button, FlatList } from 'react-native';
import { Input, Icon } from '@rneui/themed';
import axios from 'axios';
import { NGROK_URL } from '@env';
import Toast from 'react-native-root-toast';

const EventModal = ({ visible, onClose, onSubmit, friendId }) => {
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

  // Reset selectedEvent when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedEvent(null);
      setSearchText(''); // Optional: reset search text as well
    }
  }, [visible]);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSubmit = async () => {
    try {
      await onSubmit(friendId, selectedEvent?.id); // Envía friendId y eventId
      Toast.show({
        text1: 'Friend Request Sent',
        text2: 'The friend request was sent successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      Toast.show({
        text1: 'Error',
        text2: 'Could not send the friend request. Please try again.',
        type: 'error',
      });
    } finally {
      onClose(); // Cerrar modal después de la presentación
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
