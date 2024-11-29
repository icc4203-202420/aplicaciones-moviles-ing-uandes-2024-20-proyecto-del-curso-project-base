import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

const EventsList = ({ event }) => {
  return (
    <Card sx={{ maxWidth: '100%', marginBottom: 2, boxShadow: 3, marginTop:2}}>
      <CardContent sx={{ padding: 1 }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper', padding: 0.5 }}>
          <ListItem alignItems="flex-start" sx={{ padding: 0 }}>
            <ListItemAvatar>
              <Avatar alt={event.name} src={event.flyer} sx={{ width: 40, height: 40, marginRight: 2 }} />
            </ListItemAvatar>
            <ListItemText
              primary={event.name}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    {event.date}
                  </Typography>
                  {" — "}{event.description}
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default EventsList;
