import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // nuevo
import '../BarEventsList.css'; // Import the CSS file

function BarEventsList() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { barId } = useParams(); // nuevo

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/events')
      .then(response => {
        console.log('Events data:', response.data); // Verify API response
        setEvents(response.data); // Adjust to handle all events
      })
      .catch(error => {
        console.error('Error fetching the events:', error);
      });
  }, [barId]);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2 className="heading">Lista de Eventos</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Buscar evento..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ul className="event-list-container">
        {filteredEvents.map(event => (
          <li key={event.id} className="event-list-item">
            <h3>{event.name}</h3>
            <p>Descripcion: {event.description}</p>
            <p>Fecha: {new Date(event.start_date).toLocaleString()}</p>
            <p>Bar: {event.bar.name}</p> {/* Show the bar name */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BarEventsList;
