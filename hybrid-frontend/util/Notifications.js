import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

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

  const projectId = Constants.expoConfig.extra.eas.projectId || 'tu-project-id';
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
 

  return token;
}

export async function savePushToken() {
  const pushToken = await registerForPushNotificationsAsync();
  if (pushToken) {
    try {
      const authToken = await SecureStore.getItemAsync('authToken')

      await axios.post(`${NGROK_URL}/api/v1/users/update_push_token`, {
        push_token: pushToken,
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.error('Error al actualizar el token de notificación:', error);
    }
  }
}

module.exports = {
    registerForPushNotificationsAsync
}