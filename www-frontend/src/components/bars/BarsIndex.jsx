import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import pintpalLogo from './assets/pintpal-logo.png';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchBar from '../SearchBar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

const BarContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const BarName = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
  color:'black',
  fontSize: '20px'
}));

const BarAddress = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    textDecoration:'none',
  },
  color:'#858585',
  fontSize: '15px'
}));

function BarsIndex() {
  const [bars, setBars] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/bars')
      .then(response => {
        setBars(response.data);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (bar.address.line1 && bar.address.line1.toLowerCase().includes(searchText.toLowerCase())) ||
    (bar.address.city && bar.address.city.toLowerCase().includes(searchText.toLowerCase()))
  );

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
      {/* PintPal superior con el logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom: '30px' }}>
        {/* Flecha para ir hacia atrás */}
        <IconButton onClick={handleBackClick}>
          <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem', marginLeft: '-5rem' }} />
        </IconButton>
        <h2 style={{ margin: 0, color: 'black', fontSize: '2rem', fontWeight: 500 }}>PintPal</h2>
        <img src={pintpalLogo} alt="PintPal Logo" style={{ width: '50px', height: '50px' }} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <SearchBar value={searchText} onChange={handleSearchChange} />
      </div>

      <div>
      {filteredBars.length > 0 ? (
        filteredBars.map(bar => (
          <BarContainer key={bar.id}>
            <Link to={`/bars/${bar.id}`} style={{ textDecoration: 'none' }}>
              <BarName variant="h6" component="h2">
                {bar.name}
              </BarName>
            </Link>
            <Link to={`/bars/${bar.id}`} style={{ textDecoration: 'none' }}>
              <BarAddress variant="subtitle1">
                {bar.address.line1}, {bar.address.city}
              </BarAddress>
            </Link>
          </BarContainer>
        ))
      ) : (
        <Typography variant="body1" style={{ marginTop: 10, color: 'gray' }}>
          No bars found.
        </Typography>
      )}

      </div>
    </>
  );
}

export default BarsIndex;
