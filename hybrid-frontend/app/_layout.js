// app/_layout.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Estilos globales
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(250, 247, 240)",
    padding: 20,
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
});

// Componente Layout
const Layout = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

export { Layout, styles };
