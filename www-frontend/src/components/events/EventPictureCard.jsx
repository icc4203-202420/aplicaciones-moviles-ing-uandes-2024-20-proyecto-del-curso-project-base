import React, { useState } from 'react';
import { Card, CardMedia, Avatar, Box, Typography, Menu, MenuItem, IconButton } from '@mui/material';

const EventPictureCard = ({ url, firstName, lastName, taggedFriends, description }) => {
    const initial = firstName.charAt(0).toUpperCase();
    const fullName = `${firstName} ${lastName}`;
    const taggedFriendsJSON = JSON.parse(taggedFriends);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFriends, setSelectedFriends] = useState([]);

    const handleMenuOpen = (event, friends) => {
        setAnchorEl(event.currentTarget);
        setSelectedFriends(friends);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedFriends([]);
    };

    return (
        <Card sx={{ marginTop: '20px', marginBottom: '10px', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                <Avatar
                    sx={{
                        width: 35,
                        height: 35,
                        background: 'linear-gradient(to right, #FFDB01, #FF8603)',
                        color: 'white',
                        fontSize: '16px',
                    }}
                >
                    {initial}
                </Avatar>

                <Typography variant="body1" sx={{ marginLeft: '15px', fontWeight: 'bold' }}>
                    {fullName}
                </Typography>
            </Box>

            <CardMedia
                component="img"
                height="200"
                image={url}
                alt="Event Picture"
                sx={{ borderRadius: '0 0 16px 16px' }}
            />

            {description && (
                <Typography
                    variant="body2"
                    sx={{ padding: '10px', color: 'gray', textAlign: 'center' }}
                >
                    {description}
                </Typography>
            )}

            {/* taggedFriends (hasta 2 se muestran) */}
            <Box sx={{ display: 'flex', marginTop: '10px', padding: '10px', justifyContent: 'center', position: 'relative' }}>
                {taggedFriendsJSON.slice(0, 2).map((friend, index) => (
                    <div
                        key={friend.id}
                        style={{ 
                            marginRight: index === taggedFriendsJSON.slice(0, 2).length - 1 ? '0px' : '-10px',
                            position: 'relative' 
                        }}
                    >
                        <IconButton onClick={(event) => handleMenuOpen(event, [friend])}>
                            <Avatar
                                sx={{
                                    width: 30,
                                    height: 30,
                                    background: '#d9d9d9',
                                    color: 'black',
                                    fontSize: '14px',
                                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)'
                                }}
                            >
                                {friend.first_name.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                    </div>
                ))}

                {/* El resto de taggedFriends se muestran como '+N' */}
                {taggedFriendsJSON.length > 2 && (
                    <IconButton onClick={(event) => handleMenuOpen(event, taggedFriendsJSON.slice(2))}>
                        <Avatar
                            sx={{
                                width: 30,
                                height: 30,
                                background: '#d9d9d9',
                                color: 'black',
                                fontSize: '14px',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
                                marginLeft: '-10px'
                            }}
                        >
                            +{taggedFriendsJSON.length - 2}
                        </Avatar>
                    </IconButton>
                )}
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: '5px' }}
            >
                {selectedFriends.length > 0 && selectedFriends.map((friend) => (
                    <MenuItem key={friend.id} onClick={handleMenuClose}>
                        {friend.first_name} {friend.last_name}
                    </MenuItem>
                ))}
            </Menu>
        </Card>
    );
};

export default EventPictureCard;
