import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Router } from 'expo-router';
import { RootSiblingParent } from 'react-native-root-siblings';

export default function App() {
  return (
    <RootSiblingParent>
      <Router />
      {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
      <StatusBar style="auto" />
    </RootSiblingParent>
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
