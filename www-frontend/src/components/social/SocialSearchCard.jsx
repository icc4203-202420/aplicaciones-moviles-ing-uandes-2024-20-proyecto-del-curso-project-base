import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group'; 

const UsersList = ({ user, isFriend = false }) => {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2 }}>
      
      <Avatar alt={`${user.first_name} ${user.last_name}`} sx={{ width: 40, height: 40, mr: 2 }}>
        {user.first_name ? user.first_name[0] : user.handle[0]}
      </Avatar>
      
      <CardContent sx={{ padding: 0 }}>
        
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          {user.first_name ? `${user.first_name} ${user.last_name}` : user.handle}
          {isFriend && (
            <GroupIcon sx={{ ml: 1, color: 'orange', fontSize: '1.5rem' }} />
          )}
        </Typography>
        
        <Typography variant="body2" color="textSecondary">
          @{user.handle}
        </Typography>
      
      </CardContent>
    
    </Card>
  );
};

export default UsersList;
