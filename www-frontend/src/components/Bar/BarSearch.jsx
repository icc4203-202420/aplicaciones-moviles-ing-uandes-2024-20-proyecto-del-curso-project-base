import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useLoadGMapsLibraries } from '../useLoadGMapsLibraries'; // Hook para cargar las librerías
import { MAPS_LIBRARY, MARKER_LIBRARY } from '../constants'; // Constantes utilizadas
import { CircularProgress, Box, Autocomplete, TextField, Modal, Button } from '@mui/material'; // Importar Autocomplete de Material-UI
import BarDetails from './BarDetails';
const BarSearch = () => {
  const [bars, setBars] = useState([]); // Estado para almacenar los bares
  const [filteredBars, setFilteredBars] = useState([]); // Estado para almacenar los bares filtrados
  const [userLocation, setUserLocation] = useState(null); // Estado para almacenar la ubicación del usuario
  const [searchQuery, setSearchQuery] = useState(''); // Estado para almacenar la búsqueda
  const [nearestBar, setNearestBar] = useState(null); // Estado para el bar más cercano
  const [detailsOpen, setDetailsOpen] = useState(false); 
  const libraries = useLoadGMapsLibraries();
  const markerCluster = useRef();
  const mapNodeRef = useRef();
  const mapRef = useRef();
  const markersRef = useRef([]);
  const navigate = useNavigate(); // Hook for navigation

  // ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error obteniendo la ubicación del usuario', error);
          // Default fallback: centro genérico si no se puede obtener la ubicación
          setUserLocation({ lat: -33.403818, lng: -70.506816 });
        }
      );
    } else {
      // Default fallback: si el navegador no soporta Geolocation
      setUserLocation({ lat: -33.403818, lng: -70.506816 });
    }
  }, []);

  // Cargar la lista de bares
  useEffect(() => {
    axios
      .get('/api/v1/bars')
      .then((response) => {
        const barsData = Array.isArray(response.data.bars) ? response.data.bars : [];
        setBars(barsData);
        setFilteredBars(barsData); // Iniciar con la lista completa
      })
      .catch((error) => {
        console.error('Error al cargar los bares', error);
        setBars([]); // En caso de error, asegúrate de que sea un arreglo vacío
        setFilteredBars([]); // En caso de error, asegúrate de que sea un arreglo vacío
      });
  }, []);

  // Filtrar bares según el query de búsqueda y encontrar el bar más cercano
  useEffect(() => {
    const filtered = bars.filter((bar) =>
      bar.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBars(filtered);

    // Centrar el mapa en el primer resultado filtrado
    if (filtered.length > 0 && mapRef.current) {
      const firstBar = filtered[0];
      const latLng = new google.maps.LatLng(firstBar.latitude, firstBar.longitude);
      mapRef.current.panTo(latLng);
      mapRef.current.setZoom(17);
    }

    // Encontrar el bar más cercano al usuario
    if (userLocation && filtered.length > 0) {
      let nearest = filtered[0];
      let minDistance = distanceBetweenCoords(userLocation, nearest);

      filtered.forEach((bar) => {
        const dist = distanceBetweenCoords(userLocation, bar);
        if (dist < minDistance) {
          nearest = bar;
          minDistance = dist;
        }
      });

      setNearestBar(nearest); // Establecer el bar más cercano
    }
  }, [searchQuery, bars, userLocation]);

  // Función para calcular la distancia entre dos coordenadas
  const distanceBetweenCoords = (location1, location2) => {
    const R = 6371; // Radio de la tierra en km
    const dLat = deg2rad(location2.latitude - location1.lat);
    const dLng = deg2rad(location2.longitude - location1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(location1.lat)) * Math.cos(deg2rad(location2.latitude)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en km
    return distance;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  // Inicializar el mapa y los marcadores una vez que se cargan las librerías y la ubicación del usuario
  useEffect(() => {
    if (!libraries || !userLocation) {
      return;
    }

    const { Map } = libraries[MAPS_LIBRARY];
    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'BARS_MAP_ID', // Reemplaza esto con tu propio ID de mapa
      center: userLocation,
      zoom: 15,
    });

    const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];

    // Crear los marcadores y almacenarlos en markersRef
    markersRef.current = bars.map((bar) => {
      const marker = new Marker({
        position: { lat: bar.latitude, lng: bar.longitude },
        title: bar.name,
      });
      return marker;
    });

    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers: markersRef.current,
    });
  }, [libraries, userLocation, bars]);

  // Actualizar los marcadores cada vez que cambie la búsqueda
  useEffect(() => {
    if (markerCluster.current) {
      markerCluster.current.clearMarkers();
      markerCluster.current.addMarkers(
        filteredBars.map((bar) => {
          return new google.maps.Marker({
            position: { lat: bar.latitude, lng: bar.longitude },
            title: bar.name,
          });
        })
      );
    }
  }, [filteredBars]);

  const handleNearestBarClick = () => {
    if (nearestBar) {
      setDetailsOpen(true); // Abrir el modal con los detalles del bar más cercano
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false); // Cerrar el modal
  };
  if (!libraries || !userLocation) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        style={{ height: '100vh', width: '100vw' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Autocomplete
        freeSolo
        options={bars.map((bar) => bar.name)} // Opciones basadas en los nombres de los bares
        onInputChange={(event, newInputValue) => setSearchQuery(newInputValue)} // Actualizar el estado de búsqueda al escribir
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Bars"
            variant="outlined"
            sx={{ 
              position: 'absolute', 
              top: '10px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              zIndex: 1000,
              backgroundColor: 'white',
              borderRadius: '20px', // Bordes más redondeados
              width: '80%', // Ajustar el ancho a 80% de la pantalla
              maxWidth: '600px', // Definir un ancho máximo para pantallas grandes
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Agregar una pequeña sombra para que se vea flotante
            }}
          />
        )}
      />

      <div ref={mapNodeRef} style={{ width: '100vw', height: '70vh' }} /> {/* Mapa reducido a 70vh */}
      
      <Box
        sx={{
          backgroundColor: '#fff',
          color: 'black', // Texto negro
          padding: '20px',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1000,
          cursor: nearestBar ? 'pointer' : 'default', // Mostrar que es clicable si hay un bar cercano
        }}
        onClick={handleNearestBarClick} // Añadir evento click para abrir el modal
      >
        <h2>Nearest Bar</h2>
        {nearestBar ? (
          <p>{nearestBar.name}</p>
        ) : (
          <p>No nearby bars found</p>
        )}
      </Box>

      {/* Modal para mostrar los detalles del bar más cercano */}
      <Modal open={detailsOpen} onClose={handleCloseDetails}>
        <BarDetails bar={nearestBar} onClose={handleCloseDetails} />
      </Modal>
    </div>
  );
};

export default BarSearch;
