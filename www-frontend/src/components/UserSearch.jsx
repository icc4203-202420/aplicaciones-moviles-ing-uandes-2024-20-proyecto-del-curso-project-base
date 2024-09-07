import React, { useState, useEffect } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Container } from '@mui/material';
import axios from 'axios';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para manejar la búsqueda de usuarios
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        // Hacer una solicitud al backend para obtener los usuarios
        const response = await axios.get(`/api/v1/users?search=${searchTerm}`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }

      setLoading(false);
    };

    // Solo buscar si el término de búsqueda no está vacío
    if (searchTerm) {
      fetchUsers();
    } else {
      setUsers([]); // Si no hay término de búsqueda, limpiar los resultados
    }
  }, [searchTerm]);

  return (
    <Container>
      <h2>Búsqueda de Usuarios</h2>

      {/* Input de búsqueda */}
      <TextField
        label="Buscar por nombre"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Mostrar spinner de carga si está buscando */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default UserSearch;
