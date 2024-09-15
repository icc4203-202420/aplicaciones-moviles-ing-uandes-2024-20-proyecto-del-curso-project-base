import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const BarDetails = ({ bar, onClose }) => {
  // Verificar que `bar` está definido
  if (!bar) {
    return null; // O mostrar un mensaje de error o un estado vacío
  }

  // Verifica que las propiedades están definidas
  const { name, address } = bar;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '600px',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '8px',
      }}
    >
      <Typography variant="h6" component="h2">
        {name || 'No Name'}
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        {address?.line1 || 'No Address'}
      </Typography>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={onClose}>
        Close
      </Button>
    </Box>
  );
};

export default BarDetails;
