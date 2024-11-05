import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "@rneui/themed";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NGROK_URL } from '@env';
// import { registerForPushNotificationsAsync } from "../util/Notifications";
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage(""); // Limpiar el mensaje de error al intentar iniciar sesión
    try {
      // const pushToken = await registerForPushNotificationsAsync();
      // console.log("PUSH TOKEN:", pushToken);
      // Realizar la solicitud de inicio de sesión
      const response = await axios.post(`${NGROK_URL}/api/v1/login`, {
        user: {
          email: email.toLowerCase(),
          password,
          // push_token: pushToken,
        },
      });

      if (response.status === 200) {
        const token = response.headers['authorization'];
        const USER_ID = response.data.status.data.user.id;
        // Guardar el token en AsyncStorage
        await AsyncStorage.setItem("authToken", token);
        // await AsyncStorage.setItem("pushToken", pushToken);
        await AsyncStorage.setItem("USER_ID", USER_ID.toString());
        console.log("Token JWT guardado:", token);
        // console.log("Token notificaciones guardado:", pushToken);
        // Redirigir al usuario a la página principal
        router.push("/home");
      } else {
        // Manejar el error en caso de credenciales inválidas
        setErrorMessage(response.data.message || "Credenciales inválidas, por favor intente nuevamente.");
      }
    } catch (error) {
      // Manejo de errores de red y errores específicos de la respuesta
      if (error.response) {
        setErrorMessage("Credenciales incorrectas");
      } else {
        setErrorMessage("Error de conexión");
      }
    }
  };

  useEffect(() => {
    // Verificar si hay un token existente y redirigir si el usuario ya está autenticado
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const user = await AsyncStorage.getItem("USER_ID");
      if (token) {
        console.log("Usuario ya autenticado, redirigiendo...");
        console.log(token);
        console.log(user);
        router.push("/home");
      }
    };
    checkLoginStatus();
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
        titleStyle={styles.buttonTitleSecondary}
      />
    </View>
  );
};

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

export default Login;
