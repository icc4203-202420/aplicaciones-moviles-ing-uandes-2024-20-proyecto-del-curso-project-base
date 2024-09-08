// import React, { useState, useEffect } from 'react';
// import { TextField, List, ListItem, ListItemText, Container, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function BeerList() {
//   const [beers, setBeers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedBeer, setSelectedBeer] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get('/api/v1/beers')
//       .then(response => setBeers(response.data.beers))
//       .catch(error => console.error('Error fetching beers:', error));
//   }, []);

//   const handleBeerClick = (beer) => {
//     setSelectedBeer(beer);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedBeer(null);
//   };

//   const handleSeeDetailsClick = () => {
//     navigate(`/beers/${selectedBeer.id}`);
//     handleCloseDialog();
//   };

//   const filteredBeers = beers.filter(beer =>
//     beer.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>
//         Lista de Cervezas
//       </Typography>
//       <TextField
//         label="Buscar cervezas..."
//         variant="outlined"
//         fullWidth
//         margin="normal"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <Paper>
//         <List>
//           {filteredBeers.length > 0 ? (
//             filteredBeers.map(beer => (
//               <ListItem button key={beer.id} onClick={() => handleBeerClick(beer)}>
//                 <ListItemText primary={beer.name} />
//               </ListItem>
//             ))
//           ) : (
//             <ListItem>
//               <ListItemText primary="No hay cervezas disponibles" />
//             </ListItem>
//           )}
//         </List>
//       </Paper>

//       {selectedBeer && (
//         <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
//           <DialogTitle>Detalles de {selectedBeer.name}</DialogTitle>
//           <DialogContent>
//             <Typography variant="h6">Brewery: {selectedBeer.brewery_name}</Typography>
//             <Typography variant="h6">Bars Serving This Beer:</Typography>
//             <List>
//               {selectedBeer.bars.map(bar => (
//                 <ListItem key={bar.id}>
//                   <ListItemText primary={bar.name} />
//                 </ListItem>
//               ))}
//             </List>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleSeeDetailsClick} color="primary">
//               See Details
//             </Button>
//             <Button onClick={handleCloseDialog} color="secondary">
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}
//     </Container>
//   );
// }

// export default BeerList;
// src/components/BeerList.jsx
import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Container, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BeerPopup from './BeerPopup';

function BeerList() {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/v1/beers')
      .then(response => setBeers(response.data.beers))
      .catch(error => console.error('Error fetching beers:', error));
  }, []);

  const handleBeerClick = (beer) => {
    setSelectedBeer(beer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBeer(null);
  };

  const handleSeeDetailsClick = () => {
    navigate(`/beers/${selectedBeer.id}`);
    handleCloseDialog();
  };

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Lista de Cervezas
      </Typography>
      <TextField
        label="Buscar cervezas..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Paper>
        <List>
          {filteredBeers.length > 0 ? (
            filteredBeers.map(beer => (
              <ListItem button key={beer.id} onClick={() => handleBeerClick(beer)}>
                <ListItemText primary={beer.name} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay cervezas disponibles" />
            </ListItem>
          )}
        </List>
      </Paper>

      <BeerPopup
        open={openDialog}
        beer={selectedBeer}
        onClose={handleCloseDialog}
        onSeeDetails={handleSeeDetailsClick}
      />
    </Container>
  );
}

export default BeerList;
