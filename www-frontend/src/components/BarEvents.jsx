import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BarEvents() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("Bar ID:", id); // Verifica el valor del ID
    axios.get(`/api/v1/bars/${id}/events`)
      .then(response => setEvents(response.data.events))
      .catch(error => console.error('Error fetching events:', error));
  }, [id]);

  return (
    <div>
      <h2>Events at Bar</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default BarEvents;