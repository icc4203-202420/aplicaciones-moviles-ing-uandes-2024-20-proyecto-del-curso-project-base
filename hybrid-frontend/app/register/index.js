import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed'; // Usamos @rneui/themed para los componentes
import { useRouter } from 'expo-router'; // Usamos useRouter para la navegación
import axios from 'axios';

const RegisterScreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage(''); // Reseteamos el mensaje de error al intentar registrarse
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      console.log('Registrando usuario...');
      
      const response = await axios.post(`http://192.168.4.179:3000/api/v1/signup`, {
        user: {
          first_name: firstName,
          last_name: lastName,
          handle,
          email: email.toLowerCase(),
          password,
          password_confirmation: confirmPassword,
        },
      });

      console.log('Estado de la respuesta:', response.status);
      console.log('Datos de la respuesta:', response.data);

      if (response.status === 200) {
        console.log('Registro exitoso:', response.data);
        // Navegar a la pantalla de inicio después de un registro exitoso
        router.push('/home');
      } else {
        setErrorMessage(response.data.message || 'No se pudo completar el registro.');
      }
    } catch (error) {
      console.error('Error de red:', error);

      if (error.response && error.response.status === 422) {
        // Muestra los errores específicos del servidor si el estado es 422
        const serverErrors = error.response.data.errors || { message: 'Error desconocido al registrarse' };
        const errorMessages = Object.values(serverErrors).flat().join('\n');
        Alert.alert('Error al registrarse', errorMessages);
      } else {
        // Otros errores, por ejemplo, problemas de conexión
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
