import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate para la navegación
import EventPictureUpload from './EventPictureUpload';
import './BarDetail.css';

function BarDetail() {
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [attendees, setAttendees] = useState({});
  const [message, setMessage] = useState('');
  const [refresh, setRefresh] = useState(false);
  const { barId } = useParams();
  const navigate = useNavigate(); // Inicializa useNavigate
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/bars/${barId}`)
      .then(response => {
        setBar(response.data.bar);
      })
      .catch(error => {
        console.error('Error obteniendo detalles del bar:', error);
      });

    axios.get(`http://localhost:3001/api/v1/bars/${barId}/events`)
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Error obteniendo eventos del bar:', error);
      });

  }, [barId]);

  const handleAttend = (eventId) => {
    if (!currentUser) {
      alert('You must be logged in to attend an event.');
      return;
    }

    if (attendance) {
      axios.put(`/attendances/${attendance.id}`, {
        "user_id": currentUser.id,
        "event_id": eventId,
        "checked_in": true
      }, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      })
      .then((res) => {
        setAttendance(res.data.attendance);
        setMessage('Asistencia actualizada');
      })
      .catch((error) => {
        console.error('Error actualizando la asistencia:', error);
        setMessage('Error al actualizar la asistencia');
      });
    } else {
      axios.post(`/attendances`, {
        "user_id": currentUser.id,
        "event_id": eventId,
        "checked_in": true
      }, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      })
      .then((res) => {
        setAttendance(res.data.attendance);
        setMessage('Asistencia confirmada');
      })
      .catch((error) => {
        console.error('Error posteando asistencia:', error);
        setMessage('Error al confirmar la asistencia');
      });
    }
  };

  const handleShowAttendees = (eventId) => {
    axios.get(`http://localhost:3001/api/v1/bars/${barId}/events/${eventId}/attendees`, {
      headers: { Authorization: `Bearer ${currentUser.token}` }
    })
    .then(response => {
      setAttendees(prev => ({ ...prev, [eventId]: response.data }));
    })
    .catch(error => {
      console.error('Error obteniendo asistentes:', error);
    });
  };

  const handleEventDetail = (eventId) => {
    navigate(`/bars/${barId}/event/${eventId}`); // Navega a la URL del detalle del evento
  };

  if (!bar) {
    return <div>Cargando detalles del bar...</div>;
  }

  return (
    <div className="bar-detail-container">
      <h1>{bar.name}</h1>
      <p>Dirección: {bar.address.line1}, {bar.address.city}</p>

      <h2 className="events-heading">Eventos</h2>

      <ul className="event-list">
        {events.length === 0 ? (
          <p>No hay eventos disponibles para este bar.</p>
        ) : (
          events.map(event => (
            <li key={event.id} className="event-item">
              <h3>{event.name}</h3>
              <p>Descripción: {event.description}</p>
              <p>Fecha: {new Date(event.start_date).toLocaleString()}</p>

              {/* Botón para confirmar asistencia */}
              <button onClick={() => handleAttend(event.id)}>Confirmar asistencia</button>
              {message && <p>{message}</p>}

              {/* Botón para mostrar lista de asistentes */}
              <button onClick={() => handleShowAttendees(event.id)}>Ver asistentes</button>
              {attendees[event.id] && (
                <div>
                  <h4>LISTA DE ASISTENTES</h4>
                  <ul>
                    {attendees[event.id].map(attendee => (
                      <li key={attendee.id}>
                        {attendee.first_name} {attendee.last_name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nuevo botón para ver los detalles del evento */}
              <button onClick={() => handleEventDetail(event.id)}>Ver detalles del evento</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default BarDetail;
