import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Loader } from '@googlemaps/js-api-loader';
import axios from 'axios';
import { useLoadGMapsLibraries } from '../useLoadGMapsLibraries'; // Hook para cargar las librerías
import { MAPS_LIBRARY, MARKER_LIBRARY } from '../constants'; // Constantes utilizadas
import { CircularProgress, Box } from '@mui/material';
const BarSearch = () => {
  const [bars, setBars] = useState([]); // Estado para almacenar los bares
  const [userLocation, setUserLocation] = useState(null); // Estado para almacenar la ubicación del usuario
  const [searchQuery, setSearchQuery] = useState('');
  const libraries = useLoadGMapsLibraries();
  const markerCluster = useRef();
  const mapNodeRef = useRef();
  const mapRef = useRef();

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

  // Cargar la lista de bares desde el backend
  useEffect(() => {
    axios
      .get('/api/v1/bars')
      .then((response) => {
        const barsData = Array.isArray(response.data.bars) ? response.data.bars : [];
        const filteredBars = barsData.filter(bar => 
          bar.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setBars(filteredBars);  // Actualiza el estado con bares filtrados
      })
      .catch((error) => {
        console.error('Error al cargar los bares', error);
        setBars([]);  // En caso de error, asegura un arreglo vacío
      });
  }, [searchQuery]);  // Se actualiza cada vez que cambie el valor de búsqueda
  

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
    const markers = bars.map((bar) => new Marker({
      position: { lat: bar.latitude, lng: bar.longitude },
      title: bar.name,
    }));

    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });
  }, [libraries, userLocation, bars]);

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
      <input
        type="text"
        placeholder="Search Bars"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}
      />
      <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
};

export default BarSearch;
