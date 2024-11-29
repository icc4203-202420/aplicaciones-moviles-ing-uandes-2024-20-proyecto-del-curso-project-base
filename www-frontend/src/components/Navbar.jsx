import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import SportsBarIcon from '@mui/icons-material/SportsBar';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path); 
  };

  return (
    <Box sx={{ width: 500 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          switch (newValue) {
            case 0:
              handleNavigation('/'); // En caso de apretar HomeIcon
              break;
            case 1:
              handleNavigation('/beers'); // En caso de apretar SportsBarIcon
              break;
            case 2:
              handleNavigation('/bars'); // En caso de apretar el LocationOnIcon
              break;
            case 3:
              handleNavigation('/social'); // En caso de apretar el GroupIcon
              break;
            default:
              break;
          }
        }}
        sx={{ backgroundColor: 'black' }}
      >
        <BottomNavigationAction
        //   label="Home" 
          icon={<HomeIcon />}
          sx={{ color: 'white', '&.Mui-selected': { color: 'white' } }}
        />

        <BottomNavigationAction
        //   label="Beers" 
          icon={<SportsBarIcon />}
          sx={{ color: 'white', '&.Mui-selected': { color: 'white' } }}
        />

        <BottomNavigationAction
        //   label="Bars"
          icon={<LocationOnIcon />}
          sx={{ color: 'white', '&.Mui-selected': { color: 'white' } }}
        />

        <BottomNavigationAction
        //   label="Social"
          icon={<GroupIcon />}
          sx={{ color: 'white', '&.Mui-selected': { color: 'white' } }}
        />

      </BottomNavigation>
    </Box>
  );
}