import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EventList() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Llama a la API para obtener la lista de eventos
    axios.get('/api/v1/events')
      .then(response => {
        // Verifica la estructura de la respuesta
        console.log('Fetched events:', response.data);
        setEvents(response.data.events); // Asegúrate de que ⁠ response.data.events ⁠ sea la estructura correcta
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Event List</h2>
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <li key={event.id}>{event.name}</li>
          ))
        ) : (
          <li>No events available</li>
        )}
      </ul>
    </div>
  );
}

export default EventList;