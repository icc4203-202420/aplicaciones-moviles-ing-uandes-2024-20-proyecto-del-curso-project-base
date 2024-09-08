import React from 'react';
import styled from '@mui/material/styles/styled'; //esto se cayo a ultimo momento en los test lo odio!!
import { AppBar, Box, Toolbar, InputBase, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

// codigo sacado descaradamente de https://mui.com/material-ui/react-app-bar/

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function SearchAppBar({ searchKeywords, setSearchKeywords }) {
  const handleInputChange = (event) => {
    setSearchKeywords(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "lightgray" }}>
        <Toolbar>
          
          <Search sx={{ bgcolor: "white" }}>
            
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            
            <StyledInputBase
              placeholder = "Introduzca su búsqueda"
              inputProps  = {{ 'aria-label': 'search' }}
              value       = {searchKeywords}
              onChange    = {handleInputChange}
            />
          
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SearchAppBar;
