import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Text } from "@rneui/themed"; // Usamos @rneui/themed para los componentes
import { useRouter } from "expo-router";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState(null); // Usamos estado local para el token

  const handleLogin = async () => {
    setErrorMessage(""); // Reseteamos el mensaje de error al intentar iniciar sesión
    try {
      console.log("Iniciando solicitud de login..."); // Log para indicar el inicio de la solicitud
      console.log("Email:", email); // Log para verificar el email ingresado
      console.log("Password:", password); // Log para verificar el password ingresado (evitar hacerlo en producción)
  
      const response = await axios.post("http://192.168.4.179:3000/api/v1/login", {
        user: {
          email: email.toLowerCase(),
          password,
        },
      });
  
      console.log("Response status:", response.status); // Log para el estado de la respuesta
      console.log("Response data:", response.data); // Log para los datos de la respuesta
  
      if (response.status === 200) {
        const tokenFromResponse = response.data.status.data.token;
        setToken(tokenFromResponse); // Almacenamos el token en el estado local
        console.log("Login exitoso. Token recibido:", tokenFromResponse); // Log para confirmar el éxito
  
        router.push("/home");
      } else {
        setErrorMessage(response.data.message || "Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Error durante el login:", error); // Log del error de red
      if (error.response) {
        setErrorMessage("Credenciales incorrectas");
      } else {
        setErrorMessage("Error de conexión");
      }
    }
  };
  

  useEffect(() => {
    // Aquí podrías agregar lógica para verificar si el usuario ya ha iniciado sesión
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
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Button
        title="Iniciar Sesión"
        onPress={handleLogin}
        buttonStyle={styles.button}
      />
      <Button
        type="outline"
        title="Crear cuenta"
        onPress={() => router.push("/register")}
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
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default Login;
