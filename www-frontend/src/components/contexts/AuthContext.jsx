import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('JWT_TOKEN'));
    const [token, setToken] = useState(localStorage.getItem('JWT_TOKEN'));
    const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('CURRENT_USER_ID'));

    const login = (newToken, userId) => {
        localStorage.setItem('JWT_TOKEN', newToken);
        localStorage.setItem('CURRENT_USER_ID', userId);
        setToken(newToken);
        setCurrentUserId(userId); // Actualiza el estado del usuario
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('JWT_TOKEN');
        localStorage.removeItem('CURRENT_USER_ID');
        setToken(null);
        setCurrentUserId(null); // Limpia el ID del usuario actual
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const currentToken = localStorage.getItem('JWT_TOKEN');
        const storedUserId = localStorage.getItem('CURRENT_USER_ID');
        if (currentToken && storedUserId) {
            setIsAuthenticated(true);
            setToken(currentToken);
            setCurrentUserId(storedUserId);
        } else {
            setIsAuthenticated(false);
            setToken(null);
            setCurrentUserId(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, currentUserId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthProvider;
