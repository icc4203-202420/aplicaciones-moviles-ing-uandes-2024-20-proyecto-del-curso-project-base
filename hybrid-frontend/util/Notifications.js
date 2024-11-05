import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import axios from 'axios';
import { NGROK_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);

    if (token) {
      await SecureStore.setItemAsync('pushToken', token);
    }
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export async function savePushToken() {
  const token = await SecureStore.getItemAsync('pushToken');
  if (!token) {
    console.log('Push token not found.');
    return;
  }

  // Opcional: Envía el token al backend si es necesario
  try {
    const authToken = await SecureStore.getItemAsync('authToken');
    await axios.post(`${NGROK_URL}/api/v1/push_tokens`, { token }, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    console.log('Push token saved to backend');
  } catch (error) {
    console.error('Error saving push token to backend:', error);
  }
}
