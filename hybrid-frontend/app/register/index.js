import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { NGROK_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Address fields
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState(''); // Añadido campo de país

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      console.log('Registrando usuario...');

      // Solo incluimos los campos de dirección si están presentes
      const address = {};
      if (line1) address.line1 = line1;
      if (line2) address.line2 = line2;
      if (city) address.city = city;
      if (country) address.country = country;

      const response = await axios.post(
        `${NGROK_URL}/api/v1/signup`,
        {
          user: {
            first_name: firstName,
            last_name: lastName,
            handle,
            email: email.toLowerCase(),
            password,
            password_confirmation: confirmPassword,
            country,
            line1,
            line2,
            city,
            ...(Object.keys(address).length && { address }) // Solo incluir dirección si hay al menos un campo
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('Estado de la respuesta:', response.status);
      console.log('Datos de la respuesta:', response.data);

      if (response.headers && response.headers.authorization) {
        const token = response.headers['authorization'];
        console.log("token", token);
        if (token) {
          await AsyncStorage.setItem('authToken', token); 
          Alert.alert('Registro exitoso');
          router.push('/home');
        } else {
          Alert.alert('Error', 'No se recibió token. Por favor, intente de nuevo.');
        }
      } else {
        Alert.alert('Error', 'Respuesta inesperada del servidor. Por favor, intente nuevamente.');
      }
    } catch (error) {
      console.error('Error de red:', error);

      if (error.response) {
        if (error.response.status === 409) {
          Alert.alert('Error', 'Correo electrónico ya registrado.');
        } else {
          Alert.alert('Error', `Error en el servidor: ${error.response.status}. Intenta nuevamente más tarde.`);
        }
        const serverErrors = error.response.data.errors || { message: 'Error desconocido al registrarse' };
        const errorMessages = Object.values(serverErrors).flat().join('\n');
        Alert.alert('Error al registrarse', errorMessages);
      } else {
        Alert.alert('Error de conexión', 'No se pudo conectar con el servidor. Por favor, intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Input
        placeholder="Nombre"
        value={firstName}
        onChangeText={(text) => {
          setFirstName(text);
          setErrorMessage('');
        }}
        autoCapitalize="words"
      />
      <Input
        placeholder="Apellido"
        value={lastName}
        onChangeText={(text) => {
          setLastName(text);
          setErrorMessage('');
        }}
        autoCapitalize="words"
      />
      <Input
        placeholder="Handle"
        value={handle}
        onChangeText={(text) => {
          setHandle(text);
          setErrorMessage('');
        }}
        autoCapitalize="none"
      />
      <Input
        placeholder="Correo electrónico"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrorMessage('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrorMessage('');
        }}
        secureTextEntry
      />
      <Input
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setErrorMessage('');
        }}
        secureTextEntry
      />

      {/* Address Fields (Opcionales) */}
      <Input
        placeholder="Dirección Línea 1 (Opcional)"
        value={line1}
        onChangeText={setLine1}
        autoCapitalize="words"
      />
      <Input
        placeholder="Dirección Línea 2 (Opcional)"
        value={line2}
        onChangeText={setLine2}
        autoCapitalize="words"
      />
      <Input
        placeholder="Ciudad (Opcional)"
        value={city}
        onChangeText={setCity}
        autoCapitalize="words"
      />
      <Input
        placeholder="País (Opcional)"
        value={country}
        onChangeText={setCountry}
        autoCapitalize="words"
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button
        title="Registrarse"
        onPress={handleRegister}
        loading={loading}
        buttonStyle={styles.button}
      />
      <Button
        type="outline"
        title="Ya tengo una cuenta"
        onPress={() => router.push('/')}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default RegisterScreen;
