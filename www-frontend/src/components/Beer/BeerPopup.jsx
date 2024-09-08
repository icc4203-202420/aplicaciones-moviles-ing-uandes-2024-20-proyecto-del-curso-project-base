// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, List, ListItem, ListItemText } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { useNavigate } from 'react-router-dom';

// const BeerPopup = ({ open, onClose, beer }) => {
//   const [currentBeer, setCurrentBeer] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (beer) {
//       setCurrentBeer(beer);
//     }
//   }, [beer]);

//   if (!currentBeer) return null;

//   const handleSeeDetails = () => {
//     navigate(`/beers/${currentBeer.id}`);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         Details of {currentBeer.name}
//         <IconButton
//           edge="end"
//           color="inherit"
//           onClick={onClose}
//           aria-label="close"
//           sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <Typography variant="h6">{currentBeer.name}</Typography>
//         <Typography variant="body1">Style: {currentBeer.style}</Typography>
//         <Typography variant="body1">Hop: {currentBeer.hop}</Typography>
//         <Typography variant="body1">Yeast: {currentBeer.yeast}</Typography>
//         <Typography variant="body1">Malts: {currentBeer.malts}</Typography>
//         <Typography variant="body1">IBU: {currentBeer.ibu}</Typography>
//         <Typography variant="body1">Alcohol: {currentBeer.alcohol}</Typography>
//         <Typography variant="body1">BLG: {currentBeer.blg}</Typography>
//         <Typography variant="body1">Average Rating: {currentBeer.avg_rating || 'Not Rated'}</Typography>

//         <Typography variant="h6" sx={{ mt: 2 }}>Brewery:</Typography>
//         <Typography variant="body1" sx={{ color: 'text.secondary' }}>{currentBeer.brewery_name || 'Not Available'}</Typography>

//         <Typography variant="h6" sx={{ mt: 2 }}>Bars Serving This Beer:</Typography>
//         {currentBeer.bar_names && currentBeer.bar_names.length > 0 ? (
//           <List>
//             {currentBeer.bar_names.map((bar, index) => (
//               <ListItem key={index} sx={{ color: 'text.secondary' }}>
//                 <ListItemText primary={bar} />
//               </ListItem>
//             ))}
//           </List>
//         ) : (
//           <Typography variant="body1" sx={{ color: 'text.secondary' }}>No bars available</Typography>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleSeeDetails} color="primary">See Details</Button>
//         <Button onClick={onClose} color="primary">Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default BeerPopup;

// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, List, ListItem, ListItemText } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { useNavigate } from 'react-router-dom';

// const BeerPopup = ({ open, onClose, beer }) => {
//   const [currentBeer, setCurrentBeer] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (beer) {
//       setCurrentBeer(beer);
//     }
//   }, [beer]);

//   if (!currentBeer) return null;

//   const handleSeeDetails = () => {
//     navigate(`/beers/${currentBeer.id}`);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         Details of {currentBeer.name}
//         <IconButton
//           edge="end"
//           color="inherit"
//           onClick={onClose}
//           aria-label="close"
//           sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <Typography variant="h6">{currentBeer.name}</Typography>
//         <Typography variant="body1">Style: {currentBeer.style}</Typography>
//         <Typography variant="body1">Hop: {currentBeer.hop}</Typography>
//         <Typography variant="body1">Yeast: {currentBeer.yeast}</Typography>
//         <Typography variant="body1">Malts: {currentBeer.malts}</Typography>
//         <Typography variant="body1">IBU: {currentBeer.ibu}</Typography>
//         <Typography variant="body1">Alcohol: {currentBeer.alcohol}</Typography>
//         <Typography variant="body1">BLG: {currentBeer.blg}</Typography>
//         <Typography variant="body1">Average Rating: {currentBeer.avg_rating || 'Not Rated'}</Typography>

//         <Typography variant="h6" sx={{ mt: 2 }}>Brewery:</Typography>
//         <Typography variant="body1" sx={{ color: 'text.secondary' }}>{currentBeer.brewery_name || 'Not Available'}</Typography>

//         <Typography variant="h6" sx={{ mt: 2 }}>Bars Serving This Beer:</Typography>
//         {currentBeer.bar_names && currentBeer.bar_names.length > 0 ? (
//           <List>
//             {currentBeer.bar_names.map((bar, index) => (
//               <ListItem key={index} sx={{ color: 'text.secondary' }}>
//                 <ListItemText primary={bar} />
//               </ListItem>
//             ))}
//           </List>
//         ) : (
//           <Typography variant="body1" sx={{ color: 'text.secondary' }}>No bars available</Typography>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleSeeDetails} color="primary">See Details</Button>
//         <Button onClick={onClose} color="primary">Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default BeerPopup;

// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, List, ListItem, ListItemText } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const BeerPopup = ({ open, onClose, beer }) => {
//   const [currentBeer, setCurrentBeer] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (beer) {
//       setCurrentBeer(beer);
//     } else {
//       // Fetch beer details if not provided
//       // You might want to pass `id` as a prop or use another method to get it
//       const fetchBeerDetails = async () => {
//         try {
//           const response = await axios.get(`http://localhost:3001/api/v1/beers/${id}`);
//           setCurrentBeer(response.data.beer);
//         } catch (error) {
//           console.error('Error fetching beer details:', error);
//         }
//       };

//       fetchBeerDetails();
//     }
//   }, [beer]);

//   if (!currentBeer) return null;

//   const handleSeeDetails = () => {
//     navigate(`/beers/${currentBeer.id}`);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>
//         Details of {currentBeer.name}
//         <IconButton
//           edge="end"
//           color="inherit"
//           onClick={onClose}
//           aria-label="close"
//           sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent
//         sx={{
//           backgroundImage: 'url(/images/IMG_2754.JPG)',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           color: 'white',
//           padding: '20px',
//           position: 'relative',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//         }}
//       >
//         <Typography variant="h4" component="div" gutterBottom>
//           {currentBeer.name}
//         </Typography>
//         <Typography variant="h6" component="div" color="text.secondary">
//           {currentBeer.style}
//         </Typography>
//         <Typography variant="body1">Hop: {currentBeer.hop}</Typography>
//         <Typography variant="body1">Yeast: {currentBeer.yeast}</Typography>
//         <Typography variant="body1">Malts: {currentBeer.malts}</Typography>
//         <Typography variant="body1">IBU: {currentBeer.ibu}</Typography>
//         <Typography variant="body1">Alcohol: {currentBeer.alcohol}</Typography>
//         <Typography variant="body1">BLG: {currentBeer.blg}</Typography>
//         <Typography variant="body1">Average Rating: {currentBeer.avg_rating || 'Not Rated'}</Typography>

//         <Typography variant="h6" sx={{ mt: 2 }}>Brewery:</Typography>
//         <Typography variant="body1" sx={{ color: 'text.secondary' }}>{currentBeer.brewery_name || 'Not Available'}</Typography>

//         <Typography variant="h6" sx={{ mt: 2 }}>Bars Serving This Beer:</Typography>
//         {currentBeer.bar_names && currentBeer.bar_names.length > 0 ? (
//           <List>
//             {currentBeer.bar_names.map((bar, index) => (
//               <ListItem key={index} sx={{ color: 'text.secondary' }}>
//                 <ListItemText primary={bar} />
//               </ListItem>
//             ))}
//           </List>
//         ) : (
//           <Typography variant="body1" sx={{ color: 'text.secondary' }}>No bars available</Typography>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleSeeDetails} color="primary">See Details</Button>
//         <Button onClick={onClose} color="primary">Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default BeerPopup;


// BeerPopup.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const BeerPopup = ({ open, onClose, beer }) => {
  const navigate = useNavigate();

  const handleSeeDetailsClick = () => {
    if (beer) {
      navigate(`/beers/${beer.id}`);
    }
    onClose();
  };

  if (!beer) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        Detalles de {beer.name}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6">Brewery: {beer.brewery_name || 'Not Available'}</Typography>
        <Typography variant="body1">Style: {beer.style}</Typography>
        <Typography variant="body1">Hop: {beer.hop}</Typography>
        <Typography variant="body1">Yeast: {beer.yeast}</Typography>
        <Typography variant="body1">Malts: {beer.malts}</Typography>
        <Typography variant="body1">IBU: {beer.ibu}</Typography>
        <Typography variant="body1">Alcohol: {beer.alcohol}</Typography>
        <Typography variant="body1">BLG: {beer.blg}</Typography>
        <Typography variant="body1">Average Rating: {beer.avg_rating || 'Not Rated'}</Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>Bars Serving This Beer:</Typography>
        {beer.bar_names && beer.bar_names.length > 0 ? (
          <List>
            {beer.bar_names.map((bar, index) => (
              <ListItem key={index}>
                <ListItemText primary={bar} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>No bars available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSeeDetailsClick} color="primary">See Details</Button>
        <Button onClick={onClose} color="secondary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BeerPopup;

