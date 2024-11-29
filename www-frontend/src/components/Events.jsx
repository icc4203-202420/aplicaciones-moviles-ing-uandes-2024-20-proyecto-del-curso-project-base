import useAxios from 'axios-hooks';
import { Autocomplete, Typography, TextField } from '@mui/material';
import { useState } from 'react';
/* 
TODO:
Componente(s) para la interfaz que muestra los eventos en un bar (index de bares/eventos).
Es necesario llamar a endpoint GET api/v1/bar/:id/events.
Es posible que tengan que implementar la(s) ruta(s) necesaria en elbackend para que
recursos de eventos sean anidados a los bares.
Asimismo, tendrían que completar EventsController que fue requisito en la entrega pasada.
*/

const ShowEvents = ({ bars, bar }) => {
  if (!bar) return
  const eventsUrl = `http://localhost:3001/api/v1/bars/${bar.id}/events`
  const [{ data, loading, error }] = useAxios(eventsUrl)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Please enter a bar name</p>

  return (
    <ul>
      {data.events.map((event) => <li>{event.name}</li> )}
    </ul>
  )
}

const Events = () => {
  const barsUrl = 'http://localhost:3001/api/v1/bars'
  const [{ data, loading, error }] = useAxios(barsUrl)
  const [bar, setBar] = useState({})

  if (loading) return <div className='axios-state-message' id='loading-message'>Loading...</div>;
  if (error) return <div className='axios-state-message' id='loading-message'>Error loading data.</div>;
  
  const barsNames = data.bars.map((item) => item.name);

  function getBar(name) {
    const target = (name.target.textContent)
    const filteredData = data.bars.filter(bar => bar.name === target)
    setBar(filteredData[0])
  }

  return (
    <>
      <Typography variant="h2" color="#C58100" component="div">
        Events
      </Typography>
      <Autocomplete
        disablePortal
        options={barsNames}
        onChange={value => getBar(value)}
        renderInput={(params) => <TextField {...params} label="Bar" />}
      />
      <ShowEvents bars={data.bars} bar={bar} />
    </>
  );
}

export default Events;