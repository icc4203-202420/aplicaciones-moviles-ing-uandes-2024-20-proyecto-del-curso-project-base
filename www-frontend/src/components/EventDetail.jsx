import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, Typography, Button, CircularProgress, Grid } from '@mui/material';
import fetchAxios from '../Hooks/fetchaxios';

const EventDetail = () => {
  const { barId, eventId } = useParams(); // Get the barId and eventId from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]); // Store the images related to the event
  const logUser = JSON.parse(localStorage.getItem('loguser')); // Logged-in user info
  const [attending, setAttending] = useState(false); // Track if the user is attending

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventResponse = await fetchAxios.get(`/bars/${barId}/events/${eventId}`); // Corrected use of backticks
        setEvent(eventResponse.data);

        // Fetch images for the event
        const imagesResponse = await fetchAxios.get(`/bars/${barId}/events/${eventId}/event_pictures`); // Corrected use of backticks
        setImages(imagesResponse.data.images); // Assuming the images array is returned as 'images'
      } catch (error) {
        console.error('Error fetching event or images:', error);
        alert('Could not fetch event or images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [barId, eventId]);

  // Handle attending the event
  const handleAttend = async () => {
    if (!logUser) {
      alert('You need to be logged in to attend this event.');
      return;
    }

    if (attending) {
      alert('You are already attending this event!');
      return;
    }

    const data = { user_id: logUser.id }; // Sending user_id of the logged-in user

    try {
      const response = await fetchAxios.post(
        `/bars/${barId}/events/${eventId}/attendances`, // Corrected use of backticks
        data
      );

      if (response.status === 201) {
        setAttending(true);

        const newAttendee = {
          id: logUser.id,
          first_name: logUser.first_name || 'Unknown',
          last_name: logUser.last_name || 'User',
        };

        setEvent((prevEvent) => ({
          ...prevEvent,
          attendees: [...prevEvent.attendees, newAttendee], // Add new attendee to the event
        }));

        alert('You are now attending this event!');
      }
    } catch (error) {
      console.error('Error attending event:', error);
      alert('Could not attend the event. Please try again later.');
    }
  };

  // Loading state
  if (loading) {
    return <CircularProgress />; // Display a loading spinner
  }

  // Event not found state
  if (!event) {
    return <Typography>Event not found</Typography>;
  }

  return (
    <>
      <Card>
        <CardHeader title={event.name} />
        <CardContent>
          <Typography variant="h6">Event Description</Typography>
          <Typography>{event.description}</Typography>

          <Typography variant="h6">Location</Typography>
          {event.bar ? (
            <>
              <Typography>{event.bar.name}</Typography>
              <Typography>Lat: {event.bar.latitude}</Typography>
              <Typography>Lng: {event.bar.longitude}</Typography>
            </>
          ) : (
            <Typography>No location available.</Typography>
          )}

          {/* Attend button */}
          {logUser && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAttend}
              disabled={attending || loading} // Disable button if attending or loading
              style={{ marginTop: '10px' }}
            >
              {attending ? 'Attending' : 'Attend Event'}
            </Button>
          )}

          <Typography variant="h6">Attendees</Typography>
          {event.attendees && event.attendees.length > 0 ? (
            event.attendees.map((user) => (
              <Typography key={user.id}>
                {`${user.first_name} ${user.last_name}`} {/* Combine first and last name */}
              </Typography>
            ))
          ) : (
            <Typography>No attendees available.</Typography>
          )}

          {/* Link to upload photo page */}
          <Link to={`/bars/${barId}/events/${eventId}/upload-photo`}>
            <Button variant="contained" color="secondary" style={{ marginTop: '20px' }}>
              Upload Photo
            </Button>
          </Link>

          {/* Display event images */}
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Event Photos
          </Typography>
          {images.length > 0 ? (
            <Grid container spacing={2} style={{ marginTop: '10px' }}>
              {images.map((image) => (
                <Grid item xs={12} sm={6} md={4} key={image.id}>
                  <img
                    src={image.url}
                    alt="Event"
                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No photos available for this event.</Typography>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default EventDetail;
