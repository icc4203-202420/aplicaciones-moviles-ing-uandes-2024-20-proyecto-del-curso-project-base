// App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Router } from 'expo-router';

export default function App() {
  return (
    <>
      <Router />  
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
