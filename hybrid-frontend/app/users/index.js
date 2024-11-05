import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Input, ListItem, Button, Icon } from '@rneui/themed';
import axios from 'axios';
import { NGROK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import EventModal from './EventModal';
import * as Notifications from 'expo-notifications';

const UserSearchScreen = () => {
  const [currentUserId, setCurrentUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUserId = await AsyncStorage.getItem('CURRENT_USER_ID');
      if (storedUserId) {
        setCurrentUserId(storedUserId);
      }
    };
    fetchUser();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${NGROK_URL}/api/v1/users`);
      const filteredUsers = response.data.users.filter(user => user.id !== parseInt(currentUserId));
      setUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(user => user.handle.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredUsers(results);
  }, [searchText, users]);

  const handleAddFriendWithEvent = (userId) => {
    setSelectedFriendId(userId);
    setModalVisible(true);
  };

  const handleAddFriendDirect = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post(`${NGROK_URL}/api/v1/users/${currentUserId}/friendships`, {
        friendship: {
          friend_id: selectedFriendId,
        }
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });      
      alert('Solicitud de amistad enviada.');
    } catch (error) {
      console.error('Error al agregar amigo:', error);
      alert('Error al agregar amigo.');
    }
  };
  

  const handleModalSubmit = async (event) => {
    if (!currentUserId || !event) return;

    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post(`${NGROK_URL}/api/v1/users/${currentUserId}/friendships`, {
        friendship: {
          friend_id: selectedFriendId,
          event_id: event.id,
        },
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Solicitud de Amistad',
          body: 'Has enviado una solicitud de amistad con evento asociado.',
        },
        trigger: null,
      });

      Alert.alert('Éxito', 'Solicitud de amistad con evento enviada.');
    } catch (error) {
      console.error('Error al agregar amigo:', error);
      Alert.alert('Error', 'No se pudo enviar la solicitud de amistad con evento.');
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Buscar por handle..."
        value={searchText}
        onChangeText={setSearchText}
        containerStyle={styles.input}
      />
      {loading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListItem>
              <ListItem.Content>
                <ListItem.Title>{item.handle}</ListItem.Title>
                <ListItem.Subtitle>{`${item.first_name} ${item.last_name}`}</ListItem.Subtitle>
              </ListItem.Content>
              <View style={styles.buttonContainer}>
                <Button
                  title=""
                  onPress={() => handleAddFriendDirect(item.id)}
                  icon={<Icon name="person-add" color="#ffffff" />}
                  buttonStyle={styles.button}
                />
                <Button
                  title=""
                  onPress={() => handleAddFriendWithEvent(item.id)}
                  icon={<Icon name="event" color="#ffffff" />}
                  buttonStyle={styles.button}
                />
              </View>
            </ListItem>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron usuarios.</Text>}
        />
      )}
      <EventModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSubmit={handleModalSubmit}
        friendId={selectedFriendId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
  },
  button: {
    marginHorizontal: 5,
  },
});

export default UserSearchScreen;
