import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BarList() {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Llama a la API para obtener la lista de bares
    axios.get('/api/v1/bars')
      .then(response => {
        // Verifica la estructura de la respuesta
        console.log('Fetched bars:', response.data);
        setBars(response.data.bars); // Asegúrate de que ⁠ response.data.bars ⁠ sea la estructura correcta
      })
      .catch(error => console.error('Error fetching bars:', error));
  }, []);

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Bar List</h2>
      <input
        type="text"
        placeholder="Search bars..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredBars.length > 0 ? (
          filteredBars.map(bar => (
            <li key={bar.id}>{bar.name}</li>
          ))
        ) : (
          <li>No bars available</li>
        )}
      </ul>
    </div>
  );
}

export default BarList;