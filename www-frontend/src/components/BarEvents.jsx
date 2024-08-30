import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BarEvents() {
  const [bars, setBars] = useState([]);
  const [selectedBar, setSelectedBar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);

  // Obtener la lista de bares para que el usuario pueda buscar
  useEffect(() => {
    axios.get('/api/v1/bars')
      .then(response => setBars(response.data.bars))
      .catch(error => console.error('Error fetching bars:', error));
  }, []);

  // Filtrar los bares según el término de búsqueda
  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar la selección de un bar y cargar sus eventos
  const handleSelectBar = (bar) => {
    setSelectedBar(bar);
    axios.get('/api/v1/bars/${bar.id}/events')
      .then(response => setEvents(response.data.events))
      .catch(error => console.error('Error fetching events:', error));
  };

  return (
    <div>
      <h2>Find a Bar and See Its Events</h2>
      
      {/* Input para buscar un bar */}
      <input
        type="text"
        placeholder="Search for a bar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Lista de bares filtrados */}
      {filteredBars.length > 0 ? (
        <ul>
          {filteredBars.map(bar => (
            <li key={bar.id} onClick={() => handleSelectBar(bar)}>
              {bar.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bars found.</p>
      )}

      {/* Mostrar eventos si un bar ha sido seleccionado */}
      {selectedBar && (
        <div>
          <h3>Events at {selectedBar.name}</h3>
          <ul>
            {events.length > 0 ? (
              events.map(event => (
                <li key={event.id}>{event.name}</li>
              ))
            ) : (
              <p>No events found for this bar.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BarEvents;