import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('JWT_TOKEN'));
    const [token, setToken] = useState(localStorage.getItem('JWT_TOKEN'));

    const login = (newToken, userId) => {
        localStorage.setItem('JWT_TOKEN', newToken);
        localStorage.setItem('CURRENT_USER_ID', userId);
        setToken(newToken); // Actualiza el estado del token
        setIsAuthenticated(true);
    };
  
    const logout = () => {
        localStorage.removeItem('JWT_TOKEN');
        localStorage.removeItem('CURRENT_USER_ID');
        setToken(null); // Limpia el token del estado
        setIsAuthenticated(false);
    };
    
    useEffect(() => {
        const currentToken = localStorage.getItem('JWT_TOKEN');
        if (currentToken) {
            setIsAuthenticated(true);
            setToken(currentToken);
        } else {
            setIsAuthenticated(false);
            setToken(null);
        }
    }, []);

    return (
      <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

export function useAuth() {
    return useContext(AuthContext);
}
  
export default AuthProvider;