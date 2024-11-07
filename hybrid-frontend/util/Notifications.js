import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import axios from 'axios';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Obtener permisos para notificaciones
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

  const projectId = Constants.expoConfig.extra.eas.projectId || 'aa7408ab-c7a9-4230-9a68-3822874f6a9b';
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  console.log(token);
  
  // Guardar el token en SecureStore
  try {
    await SecureStore.setItemAsync('pushToken', token);
    console.log('Push token saved to SecureStore');
  } catch (error) {
    console.error('Error saving push token to SecureStore:', error);
  }
  return token;
}

export async function savePushToken() {
  const token = await SecureStore.getItemAsync('pushToken');
  if (!token) {
    console.log('Push token not found.');
    return;
  }

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
