import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed'; // Usamos @rneui/themed para los componentes
import { useRouter } from 'expo-router'; // Usamos useRouter para la navegación

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Usamos useRouter para navegar entre pantallas

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      console.log('Registrando usuario...');
      
      const response = await fetch('http://192.168.4.176:3000/api/v1/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name,
            email: email.toLowerCase(),
            password,
          },
        }),
      });

      console.log('Estado de la respuesta:', response.status);

      const data = await response.json();
      if (response.ok) {
        console.log('Registro exitoso:', data);
        router.push('/home');
      } else {
        console.log('Datos de error:', data);
        Alert.alert('Error al registrarse', data.message || 'No se pudo completar el registro.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Input
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
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
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
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
