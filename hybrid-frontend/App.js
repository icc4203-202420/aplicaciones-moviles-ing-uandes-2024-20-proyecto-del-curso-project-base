import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Router } from 'expo-router';
import Toast from 'react-native-toast-message'; // Asegúrate de importar correctamente

export default function App() {
  return (
    <View style={styles.container}>
      <Router />
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <StatusBar style="auto" />
    </View>
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
