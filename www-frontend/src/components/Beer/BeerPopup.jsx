import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const BeerPopup = ({ open, onClose, beer }) => {
  if (!beer) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Beer Details
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
        <Typography variant="h6">{beer.name}</Typography>
        <Typography variant="body1">Style: {beer.style}</Typography>
        <Typography variant="body1">Hop: {beer.hop}</Typography>
        <Typography variant="body1">Yeast: {beer.yeast}</Typography>
        <Typography variant="body1">Malts: {beer.malts}</Typography>
        <Typography variant="body1">IBU: {beer.ibu}</Typography>
        <Typography variant="body1">Alcohol: {beer.alcohol}</Typography>
        <Typography variant="body1">BLG: {beer.blg}</Typography>
        <Typography variant="body1">Average Rating: {beer.avg_rating || 'Not Rated'}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BeerPopup;
