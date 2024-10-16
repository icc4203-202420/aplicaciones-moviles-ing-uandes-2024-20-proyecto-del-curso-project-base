import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input, Button } from '@rneui/themed'; // Usamos @rneui/themed para los Inputs y Buttons
import { useRouter } from 'expo-router'; // Usamos useRouter para la navegación

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Usamos useRouter para navegar entre pantallas

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch('http://192.168.4.176:3001/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      console.log('Response status:', response.status); // Agregamos un log del estado de la respuesta
  
      const data = await response.json();
  
      if (response.ok) {
        router.push('/home');
      } else {
        console.log('Error data:', data); // Agregamos un log de los datos del error
        setErrorMessage(data.message || 'Failed to register. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error); // Agregamos un log del error de red
      setErrorMessage('Something went wrong, please try again later.');
    }
  };
  

  return (
    <View>
      <Input
        placeholder="Name"
        value={name}
        onChangeText={setName} // Cambiamos el estado del nombre
        autoCapitalize="words"
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail} // Cambiamos el estado del email
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword} // Cambiamos el estado de la contraseña
        secureTextEntry
      />
      <Input
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword} // Cambiamos el estado de la confirmación de la contraseña
        secureTextEntry
      />
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default RegisterScreen;
