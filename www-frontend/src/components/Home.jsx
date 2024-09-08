import { Button, Typography, AppBar } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

function Home() {
  const navigate = useNavigate(); 

  return (
    <>
      <AppBar sx={{ bgcolor: "lightgray" }} position="static">
        <Button variant="outlined" onClick={() => navigate('/search')}> 
          Search!!
        </Button>
      </AppBar>

      <Typography variant="h6" component="h1" align="center" gutterBottom>
        placeholder del mapa! la idea es que se muestren los mapas mas cercanos segun la locacion del usuario, pero a este punto es literalmente imposible hacer eso asi q esta vacio!!
      </Typography>

      <Typography variant="body1" align="center" gutterBottom>
        el icono del medio lleva al root btw!
      </Typography>
    </>
  );
}

export default Home;

