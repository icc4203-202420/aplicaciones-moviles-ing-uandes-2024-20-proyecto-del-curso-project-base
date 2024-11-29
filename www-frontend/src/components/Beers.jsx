import { useState } from 'react';
import useAxios from 'axios-hooks';
import { Link } from 'react-router-dom';
import './Beers.css';

const ShowBeers = ({ data, option }) => {
  const filteredData = option
    ? data.filter(beer => beer.name.toLowerCase().includes(option.toLowerCase()))
    : data;

  return (
    <ul className="beers-list">
      {filteredData.map(beer => (
        <li key={beer.id} className="beers-item">
          <Link to={`${beer.id}`} className="beers-link">{beer.name}</Link>
        </li>
      ))}
    </ul>
  );
};

const Beers = () => {
  const apiUrl = 'http://localhost:3001/api/v1/beers';
  const [{ data, loading, error }] = useAxios(apiUrl);
  const [selectedOption, setSelectedOption] = useState('');

  if (loading) return <div className="axios-state-message">Loading...</div>;
  if (error) return <div className="axios-state-message">Error loading data.</div>;

  const handleInputChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="beers-container">
      <div className="beers-title">Beers</div>

      <div className="beers-content">
        <div className="beers-list-container">
          <input
            type="text"
            className="beers-search"
            placeholder="Search for a beer"
            value={selectedOption}
            onChange={handleInputChange}
          />
          <ShowBeers data={data?.beers || []} option={selectedOption} />
        </div>
      </div>
    </div>
  );
};

export default Beers;