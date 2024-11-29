import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';


function Home() {
  return (
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '2rem', sm: '3rem', md: '4rem' } }}>
        Welcome to Beer App
      </Typography>

      <Button variant="contained" color="primary" size="large" component={Link} to="/beers">
        View Beers
      </Button>

    </Container>
  );
}

export default Home;
