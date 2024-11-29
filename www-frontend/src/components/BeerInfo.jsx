import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

function BeerInfo({ beer }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>Detalles:</Typography>
      <List>
        <ListItem>
          <ListItemText primary="Tipo" secondary={beer.beer_type || 'No disponible'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Alcohol" secondary={`${beer.alcohol || 'No disponible'}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary="IBU" secondary={beer.ibu || 'No disponible'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Lúpulo" secondary={beer.hop || 'No disponible'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Levadura" secondary={beer.yeast || 'No disponible'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Maltas" secondary={beer.malts || 'No disponible'} />
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
    </>
  );
}

export default BeerInfo;
