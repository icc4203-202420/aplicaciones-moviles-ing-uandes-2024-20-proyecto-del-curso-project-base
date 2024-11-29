import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
    ].join(','), // Definiendo Roboto como la fuente principal
    },
  palette: {
    primary: {
      main: '#569de3',  // Un azul suave, cambia esto por el color que prefieras
    },
    secondary: {
      main: '#2369ad',  // Un verde suave, cambia esto por el color que prefieras
    },
    error: {
      main: '#ff1744',
    },
    background: {
      default: '#F1DCA7',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#333333',  // Color para texto principal
      secondary: '#555555',  // Color para texto secundario
      // link: '#F1DCA7',  // Puedes agregar esto para links
    },
  },
  components: {
    // Para botones específicos puedes hacer ajustes aquí
    MuiButton: {
      styleOverrides: {
        root: {
          // Aplica estilos adicionales aquí si es necesario
          fontWeight: 'bold',
        },
      },
    },
    // Ajustes para AppBar, por ejemplo, la topbar
    MuiAppBar: {
      styleOverrides: {
        // root: {
        //   width: '100%',
        //   height: '64px',
        // },
        colorPrimary: {
          color: '#ffffff',  // Establece el color de la fuente a blanco
          backgroundColor: '#C58100',  // Cambia esto por el color que desees para la topbar
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          // width: 'auto',
          // height: '64px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }
      }
    }
  },
});

export default theme;