"use client";

import { useState, useEffect } from 'react';

import {
    APIProvider, 
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow
} from '@vis.gl/react-google-maps';

import axios from 'axios';
import SearchBar from '../SearchBar';
import pintpalLogo from "../../assets/pintpal-logo.png";
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


export default function BarsMap() {
    const [position, setPosition] = useState({ lat: -33.4, lng: -70.7 }); // Posición por defecto por si navigator.gelocation falla
    const [bars, setBars] = useState([]);
    const [openInfoWindowId, setOpenInfoWindowId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Obtiene todos los bares
    useEffect(() => {
        axios.get('http://localhost:3001/api/v1/bars')
          .then(response => {
            setBars(response.data);
          })
          .catch(error => console.error('Error al obtener los bares:', error));
      }, []);

    // Obtiene la ubicación desde el navegador del usuario
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setPosition({ lat: latitude, lng: longitude });
                }
            );
        }
    }, []);

    // Maneja el click en un Marker
    const handleMarkerClick = (barId) => {
        if (openInfoWindowId === barId) {
            setOpenInfoWindowId(null);
            setTimeout(() => setOpenInfoWindowId(barId), 0); // Para arreglar el error de clickear dos veces el mismo Marker
        } else {
            setOpenInfoWindowId(barId);
        }
    };

    const handleBackClick = () => {
        window.history.back();
      };

    // Filtrar bares
    const filteredBars = bars.filter(bar => 
        bar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bar.address.line1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bar.address.line2 && bar.address.line2.toLowerCase().includes(searchTerm.toLowerCase())) ||
        bar.address.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <>

            {/* PintPal superior con el logo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
            {/* Flecha para ir hacia atras */}
                <IconButton onClick={handleBackClick}>
                <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem', marginLeft: '-5rem' }} />
                </IconButton>
                <h2 style={{ margin: 0, color: 'black', fontSize: '2rem', fontWeight: 500 }}>PintPal</h2>
                <img src={pintpalLogo} alt="PintPal Logo" style={{ width: '50px', height: '50px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <div style={{ height: '100vh', width: '100%', borderRadius:10 }}>
                
                <Map 
                    defaultZoom={9}
                    defaultCenter={position}
                    mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
                    sx={{borderRadius:'10px'}}
                >
                {filteredBars.map(bar => (
                    <AdvancedMarker 
                        key={bar.id}
                        position={{ lat: bar.latitude, lng: bar.longitude }}
                        onClick={() => handleMarkerClick(bar.id)}
                    >
                        <Pin/>

                        {openInfoWindowId === bar.id && (
                            <InfoWindow position={{ lat: bar.latitude, lng: bar.longitude }}>
                                <div style={{
                                    padding: '0px',
                                    maxWidth: '250px',
                                    backgroundColor: '#fff',
                                    borderRadius: '10px',
                                }}>
                                    <h4 style={{ color: '#333', margin: '0 0 5px' }}>{bar.name}</h4>
                                    <p style={{ color: '#666', margin: '0 0 10px' }}>{bar.address.line1}, {bar.address.city}</p>
                                    <a href={`/bars/${bar.id}`} style={{
                                        display: 'inline-block',
                                        padding: '5px 10px',
                                        background: 'linear-gradient(to right, #FFDB01, #FF8603)',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        borderRadius: '5px',
                                        textAlign: 'center'
                                    }}>Go to bar</a>
                                </div>
                            </InfoWindow>
                        )}

                    </AdvancedMarker>
                ))}
                </Map>
            </div>
        </APIProvider>
      </>
    );
}
