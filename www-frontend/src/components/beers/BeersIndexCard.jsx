import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const BeersList = ({ beers }) => {
    return (
      <Card sx={{ maxWidth: '100%', marginBottom: 2, boxShadow: 3, marginTop: 2 }}>
        <CardContent sx={{ padding: 1 }}>
          <List sx={{ width: '100%', bgcolor: 'background.paper', padding: 0.5 }}>
            <ListItem alignItems="flex-start" sx={{ padding: 0 }}>
              <ListItemText
                primary={beers.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" sx={{ color: 'text.primary', display: 'inline' }}>
                      {beers.beer_type} - {beers.style}
                    </Typography>
                    {" — "}Alcohol: {beers.alcohol} {' '}
                    {beers.ibu} | Rating: {parseFloat(beers.avg_rating).toFixed(2) || "N/A"}
                  </>
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
};

export default BeersList;