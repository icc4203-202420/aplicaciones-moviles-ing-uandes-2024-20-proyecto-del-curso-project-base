import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { IconButton, CircularProgress, Box, Card, CardContent, Avatar, Typography, AvatarGroup } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import GroupIcon from '@mui/icons-material/Group';

export default function EventsUsers() {
    const { id } = useParams();
    const [users, setUsers] = useState(undefined);
    const [event, setEvent] = useState(undefined);
    const [friends, setFriends] = useState([]);

    const handleBackClick = () => {
        window.history.back();
    };

    useEffect(() => {
        const currentUserId = localStorage.getItem('CURRENT_USER_ID');
        
        // Obtener el evento y los usuarios del evento
        axios.get(`http://localhost:3001/api/v1/events/${id}`)
            .then(response => {
                setEvent(response.data);
                setUsers(response.data.users);
            });

        // Obtener los amigos del usuario actual
        if (currentUserId) {
            axios.get(`http://localhost:3001/api/v1/users/${currentUserId}/friendships`)
                .then(response => {
                    setFriends(response.data.friends.map(friend => friend.id));
                });
        }
    }, [id]);

    if (!users) {
        return <CircularProgress />;
    }

    // Amigos primero
    const sortedUsers = users.sort((a, b) => {
        const aIsFriend = friends.includes(a.id);
        const bIsFriend = friends.includes(b.id);
        return bIsFriend - aIsFriend;
    });

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <IconButton onClick={handleBackClick}>
                    <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem' }} />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                    {event?.name || 'Event'}
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <AvatarGroup
                    max={5}
                    sx={{
                        '& .MuiAvatarGroup-avatar': {
                            width: 40,
                            height: 40,
                            fontSize: '1rem'
                        },
                        '& .MuiAvatarGroup-count': {
                            width: 40,
                            height: 40,
                            fontSize: '1rem'
                        }
                    }}
                >
                    {sortedUsers.map(user => (
                        <Avatar key={user.id} alt={user.name}>
                            {user.first_name[0]}
                        </Avatar>
                    ))}
                </AvatarGroup>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {`${users.length} users registered for this event.`}
                </Typography>
            </Box>

            <Box>
                {sortedUsers.map(user => (
                    <Card key={user.handle} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2 }}>
                        
                        <Avatar alt={`${user.first_name} ${user.last_name}`} sx={{ width: 40, height: 40, mr: 2 }}>
                            {user.first_name[0]}
                        </Avatar>
                        
                        <CardContent sx={{ padding: '0 16px' }}>
                            
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                {`${user.first_name} ${user.last_name}`}
                                {friends.includes(user.id) && (
                                    <GroupIcon sx={{ ml: 1, color: 'orange', fontSize: '1.5rem' }} />
                                )}
                            </Typography>
                            
                            <Typography variant="body2" color="textSecondary">
                                @{user.handle}
                            </Typography>
                        
                        </CardContent>
                    
                    </Card>
                ))}
            </Box>
        </>
    );
}
