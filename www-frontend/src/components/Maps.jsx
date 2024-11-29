import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../api/axios';
import { TextField, Stack, Autocomplete } from '@mui/material';
import './Maps.css';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [bars, setBars] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedBar, setSelectedBar] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => console.error('Error getting user location:', error)
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    axiosInstance.get('/bars')
      .then((res) => {
        setBars(res.data.bars);
      })
      .catch((error) => console.error('Error loading bars data:', error));
  }, []);

  const barsMarkers = bars.map((bar) => ({
    name: bar.name,
    lat: bar.latitude,
    lng: bar.longitude
  }));

  const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
      version: 'weekly',
    });
    
    loader.importLibrary('maps').then(({ Map }) => {
      const map = new Map(mapRef.current, {
        mapId: 'DEMO_MAP_ID',
        center: selectedBar || userLocation || { lat: -33.45694, lng: -70.64827 },
        zoom: userLocation ? 14 : 4,
      });

      loader.importLibrary('marker').then(({ AdvancedMarkerElement, PinElement }) => {
        const markers = barsMarkers.map(({ lat, lng }, i) => {
          const pin = new PinElement({
            glyph: labels[i % labels.length],
            background: '#C58100',
            borderColor: '#F1DCA7',
            glyphColor: '#F1DCA7',
          });

          return new AdvancedMarkerElement({
            position: { lat, lng },
            content: pin.element,
          });
        });

        new MarkerClusterer({ map, markers });

        if (userLocation) {
          new AdvancedMarkerElement({
            position: userLocation,
            map,
            title: 'Your location',
          });
        }
      });
    });
  }, [userLocation, barsMarkers, selectedBar]);

  const handleSelectBar = (event, value) => {
    const selected = barsMarkers.find(bar => bar.name === value);
    if (selected) setSelectedBar(selected);
  };

  return (
    <div className="map-container">
      <div className="map-search-field">
        <Stack spacing={2} sx={{ width: 300 }}>
          <Autocomplete
            id="bars-list"
            freeSolo
            options={barsMarkers.map((option) => option.name)}
            renderInput={(params) => <TextField {...params} label="Search Bars" variant="outlined" />}
            onInputChange={handleSelectBar}
          />
        </Stack>
      </div>
      <div className="map-view" ref={mapRef} />
    </div>
  );
};

export default MapComponent;