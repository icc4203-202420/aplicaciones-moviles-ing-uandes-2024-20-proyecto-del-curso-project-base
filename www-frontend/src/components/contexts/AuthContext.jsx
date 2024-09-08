import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un token al cargar el contexto
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true); // El usuario está autenticado si hay un token
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/login', { email, password });
      
      // Verifica si el token está en la respuesta
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token); // Almacena el token en localStorage
        setIsAuthenticated(true); // Cambia el estado de autenticación
        console.log("Token guardado correctamente:", response.data.data.token);
      } else {
        console.error("No se recibió token en la respuesta");
      }
    } catch (error) {
      console.error("Error en el login", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Elimina el token al cerrar sesión
    setIsAuthenticated(false); // Cambia el estado de autenticación
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
    return useContext(AuthContext);
}
  
export default AuthProvider;