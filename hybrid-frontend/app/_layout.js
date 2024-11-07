// app/_layout.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView  } from 'react-native';
import BackButton from './components/BackButton';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync, setNotificationHandler } from '../util/Notifications';
// Estilos globales
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(250, 247, 240)",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "rgb(74, 73, 71)",
  },
  inputText: {
    color: "rgb(74, 73, 71)",
  },
  inputContainer: {
    borderBottomColor: "rgb(177, 116, 87)",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonPrimary: {
    backgroundColor: "rgb(177, 116, 87)",
    marginTop: 20,
  },
  buttonSecondary: {
    borderColor: "rgb(177, 116, 87)",
    marginTop: 10,
  },
  buttonTitlePrimary: {
    color: "rgb(250, 247, 240)",
  },
  buttonTitleSecondary: {
    color: "#B17457",
  },
  backButton: {

  }
});

const Layout = ({ children }) => {
    const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
      }
    );

    // Cleanup function to remove listeners when the component is unmounted
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    // Registra el dispositivo para recibir notificaciones push y obtiene el token
    registerForPushNotificationsAsync().then((token) => {
      console.log('Push Notification Token:', token);
    });
  }, []);
    // useEffect(() => {
    //   // Registra el dispositivo para recibir notificaciones push y obtiene el token
    //   registerForPushNotificationsAsync().then(token => {
    //     console.log('Push Notification Token:', token);
    //   });
  
    //   // Listener para notificaciones recibidas mientras la app está abierta
    //   const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    //     console.log('Notification received:', notification);
    //   });
  
    //   return () => {
    //     Notifications.removeNotificationSubscription(notificationListener);
    //   };
    // }, []);
  
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}></Text>
        {children}
      </SafeAreaView>
    );
  };
  
  export { Layout, styles };
