import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, TextField, Paper, CircularProgress, Container, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';
import EventPopup from './EventPopup'; // Asegúrate de que la ruta sea correcta
import { styled } from '@mui/material/styles';
import { useCheckIn } from '../../contexts/CheckInContext';
import { useAuth } from '../../contexts/AuthContext';

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
  const { currentUserId } = useAuth();
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingBars, setLoadingBars] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [cameraDialogOpen, setCameraDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { updateCheckIn } = useCheckIn();

  useEffect(() => {
    axios.get('/api/v1/bars')
      .then(response => {
        setBars(response.data.bars || []);
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
          setEvents(response.data.events || []);
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

  const handleUploadDialogOpen = (event) => {
    setSelectedEvent(event);
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
  };

  const handleCameraDialogOpen = (event) => {
    setSelectedEvent(event);
    setCameraDialogOpen(true);
    startCamera();
  };

  const handleCameraDialogClose = () => {
    setCameraDialogOpen(false);
    stopCamera();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('No se pudo acceder a la cámara.');
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasRef.current.toBlob(blob => {
      setSelectedFile(new File([blob], 'captured-image.jpg', { type: 'image/jpeg' }));
    });
    handleCameraDialogClose();
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImageUpload = () => {
    if (selectedFile && selectedEvent) {
      if (!currentUserId) {
        toast.error('Error: Usuario no autenticado.');
        return;
      }

      const formData = new FormData();
      formData.append('event_picture[image]', selectedFile);
      formData.append('event_picture[event_id]', selectedEvent.id);
      formData.append('event_picture[user_id]', currentUserId);

      axios.post(`/api/v1/events/${selectedEvent.id}/event_pictures`, formData)
        .then(response => {
          toast.success('Imagen subida con éxito');
          handleUploadDialogClose();
        })
        .catch(error => {
          console.error('Error al subir la imagen:', error);
          if (error.response && error.response.data && error.response.data.errors) {
            toast.error(`Error al subir la imagen: ${error.response.data.errors.join(', ')}`);
          } else {
            toast.error('Error al subir la imagen. Verifica los campos e intenta de nuevo.');
          }
        });
    }
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
        {/* Imagen de fondo */}
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
          padding: '2vh 4vw',
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
                                sx={{ color: 'white' }}
                              />
                              <Button variant="outlined" sx={{ color: 'white', borderColor: 'white', marginLeft: '16px' }} onClick={() => handleEventClick(event)}>
                                See Details
                              </Button>
                              <Button variant="outlined" sx={{ color: 'white', borderColor: 'white', marginLeft: '16px' }} onClick={() => handleUploadDialogOpen(event)}>
                                Subir Imagen
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

      {/* Diálogo para subir la imagen */}
      <Dialog open={uploadDialogOpen} onClose={handleUploadDialogClose}>
        <DialogTitle>Subir Imagen para {selectedEvent?.name}</DialogTitle>
        <DialogContent>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose}>Cancelar</Button>
          <Button onClick={handleImageUpload} variant="contained" color="primary">Subir</Button>
          <Button onClick={() => handleCameraDialogOpen(selectedEvent)} variant="outlined" color="secondary">Tomar con Cámara</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para capturar imagen con la cámara */}
      <Dialog open={cameraDialogOpen} onClose={handleCameraDialogClose}>
        <DialogTitle>Capturar Imagen con la Cámara para {selectedEvent?.name}</DialogTitle>
        <DialogContent>
          <video ref={videoRef} style={{ width: '100%' }}></video>
          <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCameraDialogClose}>Cancelar</Button>
          <Button onClick={captureImage} variant="contained" color="primary">Capturar y Subir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BarEvents;