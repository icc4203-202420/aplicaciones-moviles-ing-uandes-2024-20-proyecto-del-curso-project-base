import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';

function SearchUser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (query) => {
    if (query.trim() === '') {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/users/search?query=${query}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(searchUsers, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Search Users</Typography>
      <TextField
        fullWidth
        label="User handle"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        margin="normal"
      />
      {loading && <CircularProgress />}
      <List>
        {users.map(user => (
          <ListItem key={user.id}>
            <ListItemText primary={user.handle} secondary={`${user.first_name} ${user.last_name}`} />
          </ListItem>
        ))}
      </List>
      {searchTerm && !loading && users.length === 0 && (
        <Typography>No users found</Typography>
      )}
    </Container>
  );
}

export default SearchUser;