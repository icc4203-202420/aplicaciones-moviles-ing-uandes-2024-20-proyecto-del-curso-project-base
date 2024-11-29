import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; //agregue nuevo
import '../BarList.css'; // Import the CSS file

function BarList() {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); //agregue nuevo

  useEffect(() => {
    // Fetch bars data from the API
    axios.get('http://localhost:3001/api/v1/bars')
      .then(response => {
        setBars(response.data.bars); // Update state with bars data
      })
      .catch(error => {
        console.error('Error fetching the bars:', error);
      });
  }, []);

  // Filter bars by name based on searchTerm
  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hanldeBarClick = (barId) => {
    navigate(`/bars/${barId}`); //agregue nuevo
  }

  return (
    <div className="container">
      <h2 className="heading">Lista de Bares</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Buscar bar..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ul className="bar-list-container">
        {filteredBars.map(bar => (
          <li 
          key={bar.id} 
          className="bar-list-item"
          onClick={() => hanldeBarClick(bar.id)}>
            {bar.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default BarList;
