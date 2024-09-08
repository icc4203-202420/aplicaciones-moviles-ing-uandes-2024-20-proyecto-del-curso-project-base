
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Typography, List, ListItem, ListItemText, TextField, Paper, CircularProgress } from '@mui/material';
// import BeerPopup from './BeerPopup'; // Asegúrate de que la ruta sea correcta

// const BeerList = () => {
//   const [beers, setBeers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedBeer, setSelectedBeer] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);

//   useEffect(() => {
//     axios.get('http://localhost:3001/api/v1/beers')
//       .then(response => {
//         setBeers(response.data.beers || []); // Asegúrate de que sea un array
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching beers:', error);
//         setError('Failed to load beers');
//         setLoading(false);
//       });
//   }, []);

//   const filteredBeers = beers.filter(beer =>
//     beer.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleBeerClick = (beer) => {
//     setSelectedBeer(beer);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedBeer(null);
//   };

//   if (loading) return <CircularProgress />;
//   if (error) return <Typography color="error">{error}</Typography>;

//   return (
//     <div>
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
//                 <ListItemText primary={beer.name} secondary={beer.style} />
//               </ListItem>
//             ))
//           ) : (
//             <ListItem>
//               <ListItemText primary="No hay cervezas disponibles" />
//             </ListItem>
//           )}
//         </List>
//       </Paper>

//       <BeerPopup
//         open={openDialog}
//         onClose={handleCloseDialog}
//         beer={selectedBeer}
//       />
//     </div>
//   );
// };

// export default BeerList;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, TextField, Paper, CircularProgress } from '@mui/material';
import BeerPopup from './BeerPopup'; // Asegúrate de que la ruta sea correcta

const BeerList = () => {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/beers')
      .then(response => {
        setBeers(response.data.beers || []); // Asegúrate de que sea un array
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching beers:', error);
        setError('Failed to load beers');
        setLoading(false);
      });
  }, []);

  const filteredBeers = beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBeerClick = (beer) => {
    setSelectedBeer(beer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBeer(null);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
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
                <ListItemText primary={beer.name} secondary={beer.style} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay cervezas disponibles" />
            </ListItem>
          )}
        </List>
      </Paper>

      {selectedBeer && (
        <BeerPopup
          open={openDialog}
          onClose={handleCloseDialog}
          beer={selectedBeer}
        />
      )}
    </div>
  );
};

export default BeerList;

