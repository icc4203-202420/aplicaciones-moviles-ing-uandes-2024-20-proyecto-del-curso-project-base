import * as React from 'react';
import { Link } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import Paper from '@mui/material/Paper';

export default function FixedBottomNav() {
  
  return (
    <CssBaseline>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          //showLabels
          //value={value}
          sx={{bgcolor: "lightgray"}}
          onChange={(event, newValue) => {setValue(newValue);
        }}
        >

          <BottomNavigationAction icon={<PersonOutlinedIcon />} component={Link} to="/"/>
          <BottomNavigationAction icon={<LocationOnIcon />} component={Link} to="/"/>
          <BottomNavigationAction icon={<BookmarkBorderOutlinedIcon />} />
        
        </BottomNavigation>
      </Paper>
    </CssBaseline>
  );
}