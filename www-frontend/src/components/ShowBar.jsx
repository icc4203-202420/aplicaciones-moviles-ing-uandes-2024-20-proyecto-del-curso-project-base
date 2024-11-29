import axiosInstance from '../api/axios';
import { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';

import './ShowBar.css';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.toLocaleDateString('en-US', { day: 'numeric' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  return { day, month };
};

function ShowBar() {

    const { id } = useParams();
    const [ bar, setBar ] = useState([]);
    const [ events, setEvents ] = useState([]);
    const [ attendances, setAttendances ] = useState([]);
    const [ user, setUser ] = useState(JSON.parse(localStorage.getItem('Tapp/Session/currentUser')));

    useEffect(() => {
        axiosInstance.get(`/bars/${id}`)
            .then((res) => {
                setBar(res.data.bar);
            })
            .catch((error) => {
                console.error('Error loading bar data:', error);
            });
    }, [id]);

    useEffect(() => {
        axiosInstance.get(`/bars/${id}/events`)
            .then((res) => {
                setEvents(res.data.events);
            })
            .catch((error) => {
                console.error('Error loading events data:', error);
            });
    }, [id, bar]);

    useEffect(() => {
        axiosInstance.get(`/users/${user.id}/attendances`)
            .then((res) => {
                setAttendances(res.data.attendances.map((attendance) => attendance.event_id));
            })
            .catch((error) => {
                console.error('Error loading attendances data:', error);
            });
    }, [user]);

    const handleAssistance = (event, id) => {
        const data = {
            user_id: user.id,
            event_id: id,
            checked_in: true
        }
        axiosInstance.post(`/events/${id}/attendances`, data)
            .then((res) => {
                setAttendances([...attendances, id]);
            })
            .catch((error) => {
                console.error('Error checking in:', error);
            });
    };
    
    const isAttending = (id) => attendances.includes(id);

    return(
      <div className='bar-container'>
        <div className='bar-name'>
          {bar.name}
        </div>
        <div className='bar-events-header'>
          Events:
        </div>
        <div className='bar-events-list'>
          {events.map((event) => {
            const { day, month } = formatDate(event.date);
            return(
              <div className="event-list-item" key={event.id}>
                <div className="event-container">
                  <div className="event-fields">
                    <div className="event-name">
                      {event.name}
                    </div>
                    <div className="event-desc">
                      {event.description}
                    </div>
                  </div>
                  <div className="event-date">
                    <div className="event-day">{day}</div>
                    <div className="event-month">{month}</div>
                  </div>
                </div>
                <div className="event-buttons-container">
                  <button
                    className='event-check-in-button'
                    onClick={(e) => handleAssistance(e, event.id)}
                    style={{
                      backgroundColor: isAttending(event.id)? '#93DC5C' :  '#FF5C5C',
                    }}
                  >
                    {isAttending(event.id) ? 'Attending' : 'Check in'}
                  </button>
                  <button className='event-redirect-button'>
                    <Link className='event-redirect-link' to={`/events/${event.id}`}>Take a look</Link>
                  </button>
                </div>
              </div>
            )}
          )}
        </div>
      </div>
    )

}

export default ShowBar;