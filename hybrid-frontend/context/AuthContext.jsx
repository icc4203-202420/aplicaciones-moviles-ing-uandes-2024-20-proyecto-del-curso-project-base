import React, { createContext, useState, useContext, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      // const storedToken = await AsyncStorage.getItem('token');
      // const storedUser = await AsyncStorage.getItem('currentUser');
      // const storedAuth = await AsyncStorage.getItem('isAuth');
      const storedToken = await SecureStore.getItemAsync('token');
      const storedUser = await SecureStore.getItemAsync('currentUser');
      const storedAuth = await SecureStore.getItemAsync('isAuth');

      console.log('Stored user:', storedUser);
      if (storedToken) {
        setToken(storedToken);
        setCurrentUser(storedUser);
        setIsAuth(storedAuth);
      }
    } catch (e) {
      console.error('Failed to load auth state:', e);
    }
  };

  const login = async (newToken, user) => {
    try {
      setToken(newToken);
      setIsAuth(true);
      setCurrentUser(user);
      console.log('User:', user);
      await SecureStore.setItemAsync('token', JSON.stringify(newToken));
      await SecureStore.setItemAsync('currentUser', JSON.stringify(user));
      await SecureStore.setItemAsync('isAuth', JSON.stringify(isAuth));
    } catch (e) {
      console.error('Failed to save auth state:', e);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('currentUser');
      await SecureStore.deleteItemAsync('isAuth');
      setToken(null);
      setCurrentUser(null);
      setIsAuth(false);
    } catch (e) {
      console.error('Failed to remove auth state:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuth, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
