import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { IconButton, CircularProgress, Typography, Divider, Box, Card, CardContent } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchBar from '../SearchBar';
import BarImage from './assets/bar-image.png';

export default function BarsShow() {
    const { id } = useParams();
    const [bar, setBar] = useState(undefined);
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/bars/discover');
    };

    useEffect(() => {
        axios.get(`http://localhost:3001/api/v1/bars/${id}`)
            .then(response => {
                setBar(response.data.bar);
            });
    }, [id]);

    if (!bar) {
        return <CircularProgress />;
    }

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <IconButton onClick={handleBackClick}>
                    <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem' }} />
                </IconButton>
                <SearchBar value={bar.name} />
            </div>

            <div style={{ padding: '20px' }}>
                {/* Detalles del bar */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                    {bar.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', marginBottom: '10px' }}>
                    {bar.address.line1}, {bar.address.line2}, {bar.address.city}
                </Typography>
                
                {/* Horario del bar */}
                <div style={{ display: 'flex', alignItems: 'center', color: '#888', marginBottom: '20px' }}>
                    <AccessTimeIcon sx={{ marginRight: '5px' }} />
                    <Typography variant="body2">
                        18:00 PM - 4:00 AM
                    </Typography>
                </div>
                
                {/* Imagen del bar */}
                <img src={BarImage} alt="Bar image" style={{ width: '300px', height: '200px', borderRadius:'10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'}} />
                
                {/* Divider gris */}
                <Divider sx={{ backgroundColor: '#ccc', margin: '20px 0' }} />
                
                {/* Eventos que se celebran en el bar */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                    Events
                </Typography>
                
                <div style={{marginTop:'10px'}}>
                    {bar.events && bar.events.length > 0 ? (
                        bar.events.map(event => (
                            <Link key={event.id} to={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                                <Card key={event.id} sx={{ marginBottom: '20px' }}>
                                    <CardContent>
                                        
                                        <Typography variant="body2" color="text.secondary" marginBottom={'10px'}>
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                        </Typography>
                                        
                                        <Typography variant="h6" sx={{fontWeight:'bold'}}>
                                            {event.name}
                                        </Typography>
                                        
                                        <Typography variant="body2" color="text.secondary" marginTop={'10px'}>
                                            {event.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No events available.
                        </Typography>
                    )}
                </div>
            </div>
        </>
    );
}
