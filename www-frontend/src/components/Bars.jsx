import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import { Link } from 'react-router-dom';
import MapComponent from './Maps';
import './Bars.css';
import mapIcon from '../assets/mapIcon';

const ShowBars = ({ data, option }) => {
  const filteredData = option
    ? data.filter(bar => bar.name.toLowerCase().includes(option.toLowerCase()))
    : data;

  return (
    <ul className="bars-list">
      {filteredData.map(bar => (
        <li key={bar.id} className="bars-item">
          <Link to={`${bar.id}`} className="bars-link">{bar.name}</Link>
        </li>
      ))}
    </ul>
  );
};

const Bar = () => {
  const apiUrl = 'http://localhost:3001/api/v1/bars';
  const [{ data, loading, error }] = useAxios(apiUrl);
  const [selectedOption, setSelectedOption] = useState('');
  const [isMapVisible, setIsMapVisible] = useState(false);

  if (loading) return <div className="axios-state-message">Loading...</div>;
  if (error) return <div className="axios-state-message">Error loading data.</div>;

  const toggleMap = () => {
    setIsMapVisible(!isMapVisible);
  };

  const handleInputChange = (e) => {
    setSelectedOption(e.target.value);
  }

  return (
    <div className="bars-container">
      <div className="bars-title">Bars</div>
      {isMapVisible && <button onClick={toggleMap} className="bars-toggle-button">
        View List
      </button>}
      <div className="bars-content">
        {isMapVisible ? (
          <MapComponent />
        ) : (
          <div className="bars-list-container">
            <div className='search-map'>
              <input
                type="text"
                className="bars-search"
                placeholder="Search a bar"
                value={selectedOption}
                onChange={handleInputChange}
              />
              <div onClick={ toggleMap }>{mapIcon}</div>
            </div>
            <ShowBars data={data.bars} option={selectedOption} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Bar;