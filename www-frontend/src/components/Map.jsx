import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { Card, TextField, Typography, Button } from '@mui/material';
import fetchAxios from '../Hooks/fetchaxios';

const libraries = ['places'];

const mapContainerStyle = {
  height: '400px',
  width: '100%',
};

const center = {
  lat: -37.814245,
  lng: 144.963173,
};

const Map = () => {
  const apiKey = import.meta.env.VITE_MAP_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [bars, setBars] = useState([]);
  const [selectedBar, setSelectedBar] = useState(null);
  const [filteredBars, setFilteredBars] = useState([]);
  const mapRef = useRef(null);

  // Fetch the bars data
  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await fetchAxios.get('/bars');
        setBars(response.data.bars || []);
        setFilteredBars(response.data.bars || []);
      } catch (error) {
        console.error('Error fetching bars data:', error);
      }
    };

    fetchBars();
  }, []);

  // Filter bars based on search input for name, street, or country
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setFilteredBars(
      bars.filter((bar) => {
        const address = bar.address || {};
        const addressString = `${address.line1 || ''} ${address.line2 || ''} ${address.city || ''}`;
        const countryName = address.country ? address.country.name : '';
        return (
          bar.name.toLowerCase().includes(query) ||
          addressString.toLowerCase().includes(query) ||
          countryName.toLowerCase().includes(query)
        );
      })
    );
  };

  if (loadError) return <div>Error loading Google Maps API: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div>
      <Card style={{ padding: '10px', marginBottom: '10px' }}>
        <TextField
          label="Search for a Bar, Street, or Country"
          variant="outlined"
          fullWidth
          onChange={handleSearch}
          placeholder="Type bar name, street, or country..."
        />
      </Card>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        onLoad={(map) => (mapRef.current = map)}
      >
        {filteredBars.map((bar) => (
          <Marker
            key={bar.id}
            position={{ lat: bar.latitude, lng: bar.longitude }}
            onClick={() => setSelectedBar(bar)}
          />
        ))}
      </GoogleMap>

      {selectedBar && (
        <Card
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            padding: '15px',
            maxWidth: '300px',
            zIndex: 1,
          }}
        >
          <Typography variant="h6">{selectedBar.name}</Typography>
          <Typography variant="body2">
            Address: {selectedBar.address ? `${selectedBar.address.line1}, ${selectedBar.address.city}` : 'No address available'}
          </Typography>
          {selectedBar.address?.country && (
            <Typography variant="body2">
              Country: {selectedBar.address.country.name}
            </Typography>
          )}
          <Button onClick={() => setSelectedBar(null)} color="primary">
            Close
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Map;



