import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, TextField, Paper, CircularProgress, Container, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';
import EventPopup from './EventPopup'; // Asegúrate de que la ruta sea correcta
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useCheckIn } from '../../contexts/CheckInContext'; 
// Estilo personalizado para el Accordion
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.4)', // Negro con opacidad 60%
  color: 'white',
  borderRadius: '8px', // Ajusta este valor para el radio de borde deseado
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  color: 'white',
  flexDirection: 'row-reverse', // Alinea el ícono a la derecha
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: 'white', // Asegura que el color del ícono sea blanco
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
  color: 'white',
}));

const BarEvents = () => {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingBars, setLoadingBars] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { checkIns, updateCheckIn } = useCheckIn(); 
  useEffect(() => {
    axios.get('/api/v1/bars')
      .then(response => {
        setBars(response.data.bars || []); // Asegúrate de que sea un array
        setLoadingBars(false);
      })
      .catch(error => {
        console.error('Error fetching bars:', error);
        setError('Failed to load bars');
        setLoadingBars(false);
      });
  }, []);

  const filteredBars = bars.filter(bar =>
    bar.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAccordionChange = (barId) => (event, isExpanded) => {
    if (isExpanded) {
      axios.get(`/api/v1/bars/${barId}/events`)
        .then(response => {
          setEvents(response.data.events || []); // Asegúrate de que sea un array
          setExpanded(barId);
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
    } else {
      setExpanded(false);
      setEvents([]);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };
  const getEventLabel = (count) => {
    return `${count} ${count === 1 ? 'event' : 'events'}`;
  };

  if (loadingBars) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container
      maxWidth={false}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '90vh',
        padding: 0,
      }}
    >
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        <img
          src="/images/IMG_2756.JPG"
          alt="Background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -2,
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: -1,
        }} />
        <div style={{
          position: 'relative',
          padding: '2vh 4vw', // Ajustar padding para que sea proporcional a la vista
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Typography variant="h4" gutterBottom color="white" style={{ marginTop: '2vh' }}>
            Click a Bar and Search for Events
          </Typography>
          <TextField
            label="Buscar bares..."
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ color: 'white', '& .MuiInputLabel-root': { color: 'white' }, '& .MuiInputBase-root': { color: 'white' } }}
          />
          <Paper
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              padding: '1vh 2vw',
              color: 'white',
              width: '80%',
              marginTop: '2vh',
              maxHeight: '60vh',
              overflowY: 'auto',
              overflowX: 'hidden', 
            }}
          >
            <List>
              {filteredBars.length > 0 ? (
                filteredBars.map(bar => (
                  <StyledAccordion
                    key={bar.id}
                    expanded={expanded === bar.id}
                    onChange={handleAccordionChange(bar.id)}
                  >
                    <StyledAccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ fontSize: '0.9rem', color: 'white' }} />}
                      aria-controls={`panel-${bar.id}-content`}
                      id={`panel-${bar.id}-header`}
                    >
                      <Typography sx={{ color: 'white', fontWeight: 'bold', flexGrow: 1 }}>
                        {bar.name}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', marginLeft: '8px' }}>
                        {getEventLabel(bar.event_count || 0)}
                      </Typography>
                    </StyledAccordionSummary>

                    <StyledAccordionDetails>
                      <List>
                        {events.length > 0 ? (
                          events.map(event => (
                            <ListItem button key={event.id} onClick={() => handleEventClick(event)}>
                              <ListItemText
                                primary={
                                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                                    {event.name}
                                  </Typography>
                                }
                                secondary={
                                  <>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                      Start Date: {new Date(event.start_date).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                      End Date: {new Date(event.end_date).toLocaleDateString()}
                                    </Typography>
                                  </>
                                }
                                sx={{ color: 'white' }} // Para asegurar que el texto general sea blanco
                              />
                              <Button variant="outlined" sx={{ color: 'white', borderColor: 'white', marginLeft: '16px' }} onClick={() => handleEventClick(event)}>
                                See Details
                              </Button>
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText primary="No hay eventos para este bar" sx={{ color: 'white' }} />
                          </ListItem>
                        )}
                      </List>
                    </StyledAccordionDetails>
                  </StyledAccordion>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No hay bares disponibles" sx={{ color: 'white' }} />
                </ListItem>
              )}
            </List>
          </Paper>
        </div>
      </div>

      {selectedEvent && (
        <EventPopup
          open={dialogOpen}
          onClose={handleCloseDialog}
          event={selectedEvent}
          onCheckIn={() => {
            axios.post(`/api/v1/events/${selectedEvent.id}/check_in`)
              .then(response => {
                updateCheckIn(selectedEvent.id, true); // Actualiza el estado global de check-in
                handleCloseDialog(); // Cierra el diálogo después de hacer check-in
              })
              .catch(error => {
                console.error('Error confirming attendance:', error);
              });
          }}
        />
      )}
    </Container>
  );
}

export default BarEvents;
