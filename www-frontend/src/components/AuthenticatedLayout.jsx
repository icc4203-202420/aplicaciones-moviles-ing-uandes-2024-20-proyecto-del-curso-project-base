import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './Navbar';

// eslint-disable-next-line react/prop-types
function AuthenticatedLayout({ setIsAuthenticated }) {
  return (
    <>
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default AuthenticatedLayout;