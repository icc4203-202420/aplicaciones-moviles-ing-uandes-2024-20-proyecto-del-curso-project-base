import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import MapImage from './assets/map.png'; 

export default function BarsDiscoverLocationCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/bars/locations');
  };

  return (
    <Card sx={{ maxWidth: 345, boxShadow: 5}} onClick={handleClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="280"
          width="300"
          image={MapImage}
        />
      </CardActionArea>
    </Card>
  );
}