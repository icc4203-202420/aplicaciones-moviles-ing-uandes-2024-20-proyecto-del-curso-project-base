import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { Input, ListItem, Button, Icon } from '@rneui/themed';
import axios from 'axios';
import { NGROK_URL } from '@env';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import EventModal from './EventModal';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

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
      const storedUserId = await SecureStore.getItemAsync('USER_ID');
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

  const handleAddFriend = (userId) => {
    setSelectedFriendId(userId);
    setModalVisible(true);
  };

  const handleModalSubmit = async (event) => {
    if (!currentUserId || !event) return;

    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        Alert.alert('Error', 'Token de autenticación no encontrado.');
        return;
      }

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
          body: 'Has enviado una solicitud de amistad.',
        },
        trigger: null,
      });

      Alert.alert('Éxito', 'Solicitud de amistad enviada.');
    } catch (error) {
      console.error('Error al agregar amigo:', error);
      Alert.alert('Error', 'No se pudo enviar la solicitud de amistad.');
    } finally {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const { data } = response.notification.request.content;
      if (data?.url) {
        // Redirige a la ruta home/index al hacer clic en la notificación
        router.push('/home');
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => router.back()} buttonStyle={styles.backButton} />
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
              <Button 
                title="" 
                onPress={() => handleAddFriend(item.id)} 
                icon={<Icon name="person-add" color="#ffffff" />}
              />
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
});

export default UserSearchScreen;