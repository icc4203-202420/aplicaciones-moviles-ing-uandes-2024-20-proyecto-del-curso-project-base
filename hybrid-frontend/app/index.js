import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "@rneui/themed";
import { useRouter } from "expo-router";
import axios from "axios";
import { IP } from '@env';
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    setErrorMessage("");
    try {
      const response = await axios.post(`http://${IP}:3000/api/v1/login`, {
        user: {
          email: email.toLowerCase(),
          password,
        },
      });

      if (response.status === 200) {
        const tokenFromResponse = response.data.status.data.token;
        setToken(tokenFromResponse);
        router.push("/home");
      } else {
        setErrorMessage(response.data.message || "Invalid credentials, please try again.");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage("Credenciales incorrectas");
      } else {
        setErrorMessage("Error de conexión");
      }
    }
  };

  useEffect(() => {
    console.log("Verificación inicial de sesión...");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Input
        placeholder="Correo electrónico"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrorMessage("");
        }}
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        inputStyle={styles.inputText}
        inputContainerStyle={styles.inputContainer}
      />
      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrorMessage("");
        }}
        secureTextEntry
        leftIcon={{ type: "font-awesome", name: "lock" }}
        inputStyle={styles.inputText}
        inputContainerStyle={styles.inputContainer}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Button
        title="Iniciar Sesión"
        onPress={handleLogin}
        buttonStyle={styles.buttonPrimary}
        titleStyle={styles.buttonTitlePrimary}
      />
      <Button
        type="outline"
        title="Crear cuenta"
        onPress={() => router.push("/register")}
        buttonStyle={styles.buttonSecondary}
        titleStyle={styles.buttonTitleSecondary} // Aquí aplicamos el color del texto
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(250, 247, 240)", // Fondo de pantalla
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "rgb(74, 73, 71)", // Título de color oscuro
  },
  inputText: {
    color: "rgb(74, 73, 71)", // Color del texto en los inputs
  },
  inputContainer: {
    borderBottomColor: "rgb(177, 116, 87)", // Color del borde en los inputs
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonPrimary: {
    backgroundColor: "rgb(177, 116, 87)", // Color principal del botón
    marginTop: 20,
  },
  buttonSecondary: {
    borderColor: "rgb(177, 116, 87)", // Borde para el botón secundario
    marginTop: 10,
  },
  buttonTitlePrimary: {
    color: "rgb(250, 247, 240)", // Color del texto del botón primario
  },
  buttonTitleSecondary: {
    color: "#B17457", // Color personalizado del texto para el segundo botón
  },
});

export default Login;