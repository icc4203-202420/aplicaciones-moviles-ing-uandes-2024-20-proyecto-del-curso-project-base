import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, List, ListItem, ListItemText } from '@mui/material';

const Events = () => {
  const { id } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`/api/v1/bars/${id}/events`)
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
  }, [id]);

  return (
    <Container>
      <List>
        {events.map(event => (
          <ListItem key={event.id}>
            <ListItemText primary={event.name} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Events;
