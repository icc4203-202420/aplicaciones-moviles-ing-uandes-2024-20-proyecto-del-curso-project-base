import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Validation schema using Yup
const validationSchema = yup.object().shape({
    email: yup.string().email('Por favor, ingresa un email válido.').required('Email es requerido'),
    password: yup.string().min(6, 'La contraseña requiere al menos 6 caracteres').required('Contraseña es requerida')
});

export default function Login({ setIsAuthenticated, navigation, setUser }) {
    const handleSubmit = async (values) => {
        try {
            const response = await axios.post('https://a559-201-214-18-177.ngrok-free.app/api/v1/login', 
                {
                    user: {
                        email: values.email,
                        password: values.password,
                    },
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const userData = response.data.status.data.user;

            if (response.status === 200) {
                alert('Login Exitoso');
                setIsAuthenticated(true);
                setUser(userData);
                console.log('User:', userData);
                navigation.navigate('Home');
                await AsyncStorage.setItem('user', JSON.stringify(userData)); // Store user data
            } else {
                alert(`Error: ${response.data.status.message}`); // Corrected error handling
            }
        } catch (error) {
            console.error('Error en el login:', error);
            alert('Error en el login: ' + error.message); // More descriptive error message
        }
    };
            
    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.outerContainer}>
                    <View style={styles.container}>
                        <Input
                            placeholder='Email'
                            placeholderTextColor='#f9a825'
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            errorMessage={errors.email && touched.email ? errors.email : null}
                        />
                        <Input
                            placeholder='Password'
                            placeholderTextColor='#f9a825'
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry // Corrected prop name
                            errorMessage={errors.password && touched.password ? errors.password : null}
                        />
                        <Button title='Iniciar Sesión' onPress={handleSubmit} />
                        <Button title='No tienes cuenta? Regístrate' onPress={() => navigation.navigate('Register')} color='#f9a825' />
                    </View>
                </View>
            )}
        </Formik>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    inputText: {
        marginBottom: 10,
        color: '#f9a825',
        borderBottomWidth: 1,
        borderBottomColor: '#fff'
    },
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9a825'
    }
});
