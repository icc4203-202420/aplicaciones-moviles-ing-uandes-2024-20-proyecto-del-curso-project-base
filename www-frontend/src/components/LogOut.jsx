import React from 'react';
import { Button } from '@mui/material';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext'; 
function Logout() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await api.delete('/logout');
      logout(); 
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Log Out
    </Button>
  );
}

export default Logout;