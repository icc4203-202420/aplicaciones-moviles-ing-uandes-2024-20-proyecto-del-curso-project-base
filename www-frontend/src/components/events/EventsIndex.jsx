import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import pintpalLogo from './assets/pintpal-logo.png';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import EventsList from './EventsList';

const EventsIndex = () => {
  const { id } = useParams();  // Se obtiene el id de un bar desde la URL
  const [events, setEvents] = useState([]);
  const [barName, setBarName] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/bars/${id}/events`)
      .then(response => {
        setEvents(response.data);
        setBarName(response.data[0].bar.name);
        console.log(response.data);
      });
  }, [id]);

  const handleBackClick = () => {
    window.history.back('/bars');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "EEEE, MMMM dd, yyyy", { locale: enUS });
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

      <div>
        <div style={{marginLeft:'5px'}}>
            <h2 style = {{ margin: 0, color: 'black', fontSize: '1.5rem', fontWeight: 400 }}> Events in <span style={{fontWeight:600}}>{barName}</span> </h2>
        </div>
        {events.map(event => (
          <EventsList key={event.id} event={{
            name: event.name,
            date: formatDate(event.date),
            description: event.description
          }} />
        ))}
      </div>
    </>
  );
};

export default EventsIndex;
