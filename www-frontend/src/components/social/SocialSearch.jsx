import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, InputAdornment, CircularProgress, Avatar, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

function UsersIndex() {
  const [users, setUsers] = useState([]); 
  const [searchText, setSearchText] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(false);

  // Set currentUser
  useEffect(() => {
    const storedUserId = localStorage.getItem('CURRENT_USER_ID');
    if (storedUserId) {
      setCurrentUserId(storedUserId);  
    } else {
      console.error('CURRENT_USER_ID no encontrado en localStorage');
    }
  }, []);

  // Setear todos los usuarios excepto el current 
  useEffect(() => {
    if (currentUserId) {  
      setLoading(true);
      axios.get('http://localhost:3001/api/v1/users')
        .then(response => {
          const filteredUsers = response.data.users.filter(user => user.id !== parseInt(currentUserId));
          setUsers(filteredUsers);
        })
        .catch(error => {
          console.error('Error al obtener los usuarios:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentUserId]);

  const handleSearchChange = (newValue) => {
    setSearchText(newValue);
  };

  const handleUserSelect = (selectedUser) => {
    if (selectedUser) {
      return (
        <Link to={`/users/${selectedUser.id}`} style={{ textDecoration: 'none' }}>
          {selectedUser.first_name} {selectedUser.last_name}
        </Link>
      );
    }
  };

  const filteredUsers = searchText.trim() === '' ? [] : users.filter(user =>
    user.handle.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <Autocomplete
          freeSolo
          options={filteredUsers}
          getOptionLabel={(option) => option.handle || ''}
          onInputChange={(event, newValue) => handleSearchChange(newValue)}
          onChange={(_, selectedUser) => handleUserSelect(selectedUser)}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search ..."
              size="small"
              sx={{ width: 300 }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              <Link to={`/users/${option.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '10px' }}>
                <Avatar sx={{ marginRight: '10px' }}>{option.first_name ? option.first_name[0] : option.handle[0]}</Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black'}}>
                    {option.first_name ? `${option.first_name} ${option.last_name}` : option.handle}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'black' }}>
                    @{option.handle}
                  </Typography>
                </Box>
              </Link>
            </li>
          )}
        />
      </div>
    </>
  );
}

export default UsersIndex;