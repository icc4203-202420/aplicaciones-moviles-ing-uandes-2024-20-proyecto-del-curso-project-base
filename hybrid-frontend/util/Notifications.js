import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

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
    // Verificar los permisos
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

    // Obtener el token de Expo
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);
    } catch (e) {
      alert('Error getting Expo push token!');
      console.error(e);
      return;
    }

    // Guardar el token en SecureStore
    if (token) {
      await SecureStore.setItemAsync('pushToken', token);
      console.log('Push token saved to SecureStore');
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
