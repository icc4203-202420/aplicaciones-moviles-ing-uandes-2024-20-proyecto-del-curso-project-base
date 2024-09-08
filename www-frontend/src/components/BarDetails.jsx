import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Box, AppBar, Button, Toolbar, Grid } from '@mui/material';
import axios from 'axios';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {Bookmark, BookmarkBorder } from '@mui/icons-material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOn from '@mui/icons-material/LocationOn';

function BarDetails() {
  const { barId } = useParams();
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    
    axios.get(`http://127.0.0.1:3001/api/v1/bars/${barId}`)
      .then(response => {
        setBar(response.data.bar);
        return axios.get(`http://127.0.0.1:3001/api/v1/bars/${barId}/events`);
      })
      .then(response => {
        setEvents(response.data.events);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [barId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load bar details.</Typography>;

  return (
  <>
    <AppBar position="fixed" sx={{bgcolor: "lightgray"}}>
      
      <Typography color="black" align="left">
        <Button component={RouterLink} to="/search" color="inherit">
          <NavigateBeforeIcon />
          Bares
        </Button>
      </Typography>

    </AppBar>

    <Toolbar /> {/* separacion */}

    <Box>
      {bar && (
        <>
          <Typography variant="h4" align="center">
            {bar.name}
          </Typography><br /><br /><br /><br /><br /><br />
          <Typography variant="body1" align="center">
            Promedio: (placeholder rating)
          </Typography><br />
          
          <Grid container alignItems="center" justifyContent="center">
            <Typography variant="h5" align="center">
              <LocationOn fontSize="large" /> 
              
              <Typography variant="body1" align="center">
              {`lat: ${Math.round(bar.latitude * 100) / 100}, lon: ${Math.round(bar.longitude * 100) / 100}`}
              </Typography>
            
            </Typography>
          </Grid>
        </>
      )}
      
      <Box mt={4}>
        <Typography variant="h5"> <Bookmark fontSize="large"/> Eventos</Typography><br />
        {events.map(event => (
        <>
          <Grid container key={event.id} sx={{ mb: 3 }}>
            
            <BookmarkBorder />

            <Typography 
              key     = {event.id} 
              variant = "body2"
              align   = "right"
              
            >
              Evento {event.name} - {event.description} <CalendarTodayOutlinedIcon fontSize="small"/> {formatDate(event.date)}
            </Typography>

          </Grid>
        </>
        ))}
      </Box>
      

      <Toolbar />
      <Typography variant="body">(planeaba hacer esto mas lindo pero cada icono que importaba hacia que se cayera el server! gracias MUI!)</Typography>

    </Box>
  </>
  );
}

export default BarDetails;

