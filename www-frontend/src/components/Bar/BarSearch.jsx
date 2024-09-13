import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import axios from 'axios';
import { useLoadGMapsLibraries } from '../useLoadGMapsLibraries'; // Hook para cargar las librerías
import { MAPS_LIBRARY, MARKER_LIBRARY } from '../constants'; // Constantes utilizadas
import { CircularProgress, Box, Autocomplete, TextField } from '@mui/material'; // Importar Autocomplete de Material-UI

const BarSearch = () => {
  const [bars, setBars] = useState([]); // Estado para almacenar los bares
  const [filteredBars, setFilteredBars] = useState([]); // Estado para almacenar los bares filtrados
  const [userLocation, setUserLocation] = useState(null); // Estado para almacenar la ubicación del usuario
  const [searchQuery, setSearchQuery] = useState(''); // Estado para almacenar la búsqueda
  const libraries = useLoadGMapsLibraries();
  const markerCluster = useRef();
  const mapNodeRef = useRef();
  const mapRef = useRef();
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null); // Referencia para InfoWindow
    
  // Obtener la ubicación actual del usuario
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

  // Filtrar bares según el query de búsqueda
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
  }, [searchQuery, bars]);

  // Inicializar el mapa y los marcadores una vez que se cargan las librerías y la ubicación del usuario
  useEffect(() => {
    if (!libraries || !userLocation) {
      return;
    }

    const { Map, InfoWindow } = libraries[MAPS_LIBRARY];
    const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
    
    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'BARS_MAP_ID', // Reemplaza esto con tu propio ID de mapa
      center: userLocation,
      zoom: 15,
    });

    // Crear un InfoWindow
    infoWindowRef.current = new InfoWindow({
      ariaLabel: "Info Window",
    });

    // Crear los marcadores y almacenarlos en markersRef
    markersRef.current = bars.map((bar) => {
      const marker = new Marker({
        position: { lat: bar.latitude, lng: bar.longitude },
        title: bar.name,
      });

      // Crear contenido para el InfoWindow
      const contentString = `
        <div id="content">
          <div id="siteNotice"></div>
          <h1 id="firstHeading" class="firstHeading">${bar.name}</h1>
          <div id="bodyContent">
            <p>${bar.address?.line1 || 'Dirección no disponible'}, ${bar.address?.city || 'Ciudad no disponible'}</p>
          </div>
        </div>
      `;

      // Asignar contenido al InfoWindow
      marker.addListener('click', () => {
        infoWindowRef.current.setContent(contentString);
        infoWindowRef.current.open(mapRef.current, marker);
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
          return new google.maps.marker.AdvancedMarkerElement({
            position: { lat: bar.latitude, lng: bar.longitude },
            title: bar.name,
          });
        })
      );
    }
  }, [filteredBars]);

  // Función para centrar el mapa en el bar seleccionado al presionar "Enter"
  const handleEnterKey = (event) => {
    if (event.key === 'Enter' && filteredBars.length > 0) {
      const firstBar = filteredBars[0]; // Tomar el primer bar coincidente
      if (firstBar && mapRef.current) {
        const latLng = new google.maps.LatLng(firstBar.latitude, firstBar.longitude);
        mapRef.current.panTo(latLng);
        mapRef.current.setZoom(17);
      }
    }
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
      {/* Autocomplete de Material-UI para la barra de búsqueda */}
      <Autocomplete
        freeSolo
        options={bars.map((bar) => bar.name)} // Opciones basadas en los nombres de los bares
        onInputChange={(event, newInputValue) => setSearchQuery(newInputValue)} // Actualizar el estado de búsqueda al escribir
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Bars"
            variant="outlined"
            onKeyDown={handleEnterKey} // Detectar presionar "Enter"
            sx={{ 
              position: 'absolute', 
              top: '20px', // Ajusta la distancia desde la parte superior
              left: '50%', 
              transform: 'translateX(-50%)', // Esto centra el elemento horizontalmente
              zIndex: 1000,
              backgroundColor: 'white',
              borderRadius: '4px',
              width: '300px', // Ajusta el ancho según tu preferencia
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Agrega una pequeña sombra para que se vea flotante
            }}
          />
        )}
      />

      <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
};

export default BarSearch;
