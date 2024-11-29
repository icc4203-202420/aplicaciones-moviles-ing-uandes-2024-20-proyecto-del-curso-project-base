import React from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Bars() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bars</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1DCA7", // Fondo agradable
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#C58100", // Un color llamativo
    textTransform: "uppercase", // Texto en mayúsculas
  },
});