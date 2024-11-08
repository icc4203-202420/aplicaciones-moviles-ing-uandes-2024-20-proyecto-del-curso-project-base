import { useEffect } from 'react';
import { useRouter } from 'expo-router';  // Importa useRouter desde expo-router
import * as Notifications from 'expo-notifications'; // Importa expo-notifications

export default function NotificationListener() {
  const router = useRouter();

  useEffect(() => {
    // Listener para las notificaciones recibidas mientras la app está en primer plano
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      const { data } = notification.request.content;
      if (data && data.route) {
        router.push(data.route); // Redirige a la ruta especificada en la notificación
      }
    });

    // Listener para las notificaciones cuando la app está en segundo plano o cerrada
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const { data } = response.notification.request.content;
      if (data && data.route) {
        router.push(data.route); // Redirige a la ruta especificada en la notificación
        console.log("RUTA A REDIRIGIR NOTIF: ",data.route);
      }
    });

    return () => {
      // Cleanup listeners when component is unmounted
      notificationListener.remove();
      responseListener.remove();
    };
  }, [router]);

  return null;
}
