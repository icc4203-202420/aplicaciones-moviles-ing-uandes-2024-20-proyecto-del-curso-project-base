import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { useRouter } from 'expo-router'; // Usamos useRouter para la navegación

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Usamos useRouter para navegar

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.4.176:3000/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { 
            email,
            password 
          }
        }),
      });
  
      const data = await response.json();
  
      console.log('Response status:', response.status); // Agregar un log para el estado de la respuesta
      console.log('Response data:', data); // Agregar un log para los datos de la respuesta
  
      if (response.ok) {
        // Capturamos el token JWT de la respuesta
        const token = data.status.data.token;
        // Almacenamos el token en AsyncStorage
        await AsyncStorage.setItem('token', token);
        // Navegamos a la pantalla de inicio
        router.push('/home');
      } else {
        setErrorMessage(data.message || 'Invalid credentials, please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error); // Log del error de red
      setErrorMessage('Something went wrong, please try again later.');
    }
  };   
  
  return (
    <View>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      
      {/* Botón para redirigir a la pantalla de registro */}
      <Button title="Register" onPress={() => router.push('/register')} />
    </View>
  );
};

export default LoginScreen;
