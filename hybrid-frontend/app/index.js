// LoginScreen.js
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input, Button } from '@rneui/themed';  // Cambiamos la importación a @rneui/themed
import { useRouter } from 'expo-router';  // Usamos useRouter de expo-router

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Usamos useRouter para navegación

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.33.0.124:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        // Navegamos a la página de inicio después de un inicio de sesión exitoso
        router.push('/home');
      } else {
        setErrorMessage('Invalid credentials, please try again.');
      }
    } catch (error) {
      setErrorMessage('Something went wrong, please try again later.');
    }
  };

  return (
    <View>
      <Input
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.nativeEvent.text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.nativeEvent.text)}
        secureTextEntry
      />

      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
