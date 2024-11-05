import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Importa useRouter
import axios from 'axios';
import { NGROK_URL } from '@env';
import { Tab, TabView } from '@rneui/themed';
import FriendsTab from '../components/FriendsTab';
import FriendRequestsTab from '../components/FriendRequestsTab';

const UserProfileScreen = () => {
  const { id: userId } = useLocalSearchParams(); // Obtener el ID del usuario de los parámetros
  const router = useRouter(); // Inicializa el enrutador
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0); // Estado para controlar la pestaña activa

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${NGROK_URL}/api/v1/users/${userId}`);
        
        if (response.status === 200) {
          setUser(response.data); // Almacena los datos del usuario en el estado
        } else {
          console.error('Failed to fetch user data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    } else {
      console.error('No user ID found');
      setLoading(false); // Para evitar que se quede en estado de carga si no hay ID
    }
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Go Back" onPress={() => router.back()} />
      {user ? (
        <>
          <Text style={styles.title}>{user.handle}</Text>
          <Text style={styles.text}>{user.first_name} {user.last_name}</Text>

          <Tab value={index} onChange={setIndex}>
            <Tab.Item title="Friends" />
            <Tab.Item title="Friend Requests" />
          </Tab>

          <TabView value={index} onChange={setIndex} style={styles.tabView}>
            <TabView.Item>
              <FriendsTab userId={userId} />
            </TabView.Item>
            <TabView.Item>
              <FriendRequestsTab userId={userId} />
            </TabView.Item>
          </TabView>
        </>
      ) : (
        <Text style={styles.text}>No se encontró información del usuario.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabView: {
    marginTop: 20,
  },
});

export default UserProfileScreen;
