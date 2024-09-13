// import { useEffect, useRef, useState } from 'react';
// import { MarkerClusterer } from '@googlemaps/markerclusterer';
// import { Loader } from '@googlemaps/js-api-loader';
// import axios from 'axios';
// import { useLoadGMapsLibraries } from '../useLoadGMapsLibraries'; // Hook para cargar las librerías
// import { MAPS_LIBRARY, MARKER_LIBRARY } from '../constants'; // Constantes utilizadas
// import { CircularProgress, Box } from '@mui/material';
// const BarSearch = () => {
//   const [bars, setBars] = useState([]); // Estado para almacenar los bares
//   const [userLocation, setUserLocation] = useState(null); // Estado para almacenar la ubicación del usuario
//   const [searchQuery, setSearchQuery] = useState('');
//   const libraries = useLoadGMapsLibraries();
//   const markerCluster = useRef();
//   const mapNodeRef = useRef();
//   const mapRef = useRef();

//   // ubicación actual del usuario
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => {
//           console.error('Error obteniendo la ubicación del usuario', error);
//           // Default fallback: centro genérico si no se puede obtener la ubicación
//           setUserLocation({ lat: -33.403818, lng: -70.506816 });
//         }
//       );
//     } else {
//       // Default fallback: si el navegador no soporta Geolocation
//       setUserLocation({ lat: -33.403818, lng: -70.506816 });
//     }
//   }, []);

//   // Cargar la lista de bares 
//   useEffect(() => {
//     axios
//       .get('/api/v1/bars')
//       // .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/bars`)
//       .then((response) => {
//         // Accede a los bares dentro de la clave "bars"
//         // console.log('Fetched bars:', response.data);
//         const barsData = Array.isArray(response.data.bars) ? response.data.bars : [];
//         setBars(barsData);
//         console.log(barsData);
//       })
//       .catch((error) => {
//         console.error('Error al cargar los bares', error);
//         setBars([]); // En caso de error, asegúrate de que sea un arreglo vacío
//       });
//   }, [searchQuery]);
  

//   // Inicializar el mapa y los marcadores una vez que se cargan las librerías y la ubicación del usuario
//   useEffect(() => {
//     if (!libraries || !userLocation) {
//       return;
//     }

//     const { Map } = libraries[MAPS_LIBRARY];
//     mapRef.current = new Map(mapNodeRef.current, {
//       mapId: 'BARS_MAP_ID', // Reemplaza esto con tu propio ID de mapa
//       center: userLocation,
//       zoom: 15,
//     });

//     const { AdvancedMarkerElement: Marker } = libraries[MARKER_LIBRARY];
//     const markers = bars.map((bar) => new Marker({
//       position: { lat: bar.latitude, lng: bar.longitude },
//       title: bar.name,
//     }));

//     markerCluster.current = new MarkerClusterer({
//       map: mapRef.current,
//       markers,
//     });
//   }, [libraries, userLocation, bars]);

//   if (!libraries || !userLocation) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         style={{ height: '100vh', width: '100vw' }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search Bars"
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000 }}
//       />
//       <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />
//     </div>
//   );
// };

// export default BarSearch;


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

  // Filtrar bares según el query de búsqueda
  useEffect(() => {
    const filtered = bars.filter((bar) =>
      bar.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBars(filtered);

    // Si solo hay un bar que coincide, hacemos zoom en él
    if (filtered.length === 1 && mapRef.current) {
      const bar = filtered[0];
      mapRef.current.panTo({ lat: bar.latitude, lng: bar.longitude }); // Centrar el mapa
      mapRef.current.setZoom(17); // Ajustar el zoom
    }
  }, [searchQuery, bars]);

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
    markersRef.current = filteredBars.map((bar) => {
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
  }, [libraries, userLocation, filteredBars]);

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
            sx={{ 
              position: 'absolute', 
              top: '10px', 
              left: '10px', 
              zIndex: 1000,
              backgroundColor: 'white',
              borderRadius: '4px',
              width: '250px',
            }}
          />
        )}
      />

      <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
};

export default BarSearch;



