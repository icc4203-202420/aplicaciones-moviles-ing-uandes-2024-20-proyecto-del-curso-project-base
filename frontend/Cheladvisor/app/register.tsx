import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { useRouter } from "expo-router";
import axios from "axios";
import { palette } from "../assets/palette";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/signup`,
        {
          user: {
            email,
            password,
            password_confirmation: passwordConfirmation,
            first_name: firstName,
            last_name: lastName,
            handle,
          },
        }
      );

      router.push("/");
    } catch (error) {
      Alert.alert(
        "Usuario ya existente",
        "Por favor, intente con otras credenciales.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Input
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input
        placeholder="Confirmar contraseña"
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      <Input
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Input
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
      <Input
        placeholder="Handle"
        value={handle}
        onChangeText={setHandle}
      />
      <Button
        title="Registrarse"
        onPress={handleRegister}
        loading={loading}
        buttonStyle={styles.button}
      />
      <Button
        title="Ya tengo una cuenta"
        onPress={() => router.push("/")}
        loading={loading}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: palette.background,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: palette.lager,
  },
  button: {
    marginTop: 20,
    backgroundColor: palette.amber,
    color: palette.lager,
  },
});

export default Register;
