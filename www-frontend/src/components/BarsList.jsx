import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, CircularProgress, Box, Grid, Link } from '@mui/material';
import { LocationOn, StarOutline } from '@mui/icons-material';
import axios from 'axios';

function BarsList({ searchKeywords }) {
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:3001/api/v1/bars')
      .then(response => {
        setBars(response.data.bars);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load bars.</Typography>;

  // Filter bars based on search keywords
  const filteredBars = bars.filter(bar => 
    bar.name.toLowerCase().includes(searchKeywords.toLowerCase())
  );

  return (
    <Box>
      
      {filteredBars.map(bar => (
        <Grid container spacing={2} alignItems="center" key={bar.id} sx={{ mb: 3 }}>
          
          {/* locacion!! */}
          <Grid item>
            <LocationOn fontSize="small" />
            <Typography variant="caption" display="block">
              {`lat: ${Math.round(bar.latitude * 100) / 100}, lon: ${Math.round(bar.longitude * 100) / 100}`}
            </Typography>
          </Grid>

          {/* nombre */}
          <Grid item xs>
            <Link
                key       = {bar.id}
                component = {RouterLink}
                to        = {`/bars/${bar.id}`}
                underline = "none"
            >
              <Typography variant="h6" fontWeight="bold">
                {bar.name}
              </Typography>
            
            </Link>
           
          </Grid>

          {/* rating (por mientras vacio!) */}
          <Grid item>
            <Box display="flex" alignItems="center">
              {Array.from({ length: 5 }, (_, index) => (
                <StarOutline
                  key={index} 
                  fontSize="small" 
                />
              ))}
            </Box>
          </Grid>
          
        </Grid>
      ))}
    </Box>
  );
}

export default BarsList;