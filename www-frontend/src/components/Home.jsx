import * as React from 'react';
import BarsHomeCard from './bars/BarsHomeCard';
import BeersHomeCard from './beers/BeersHomeCard';
import SocialHomeCard from './social/SocialHomeCard';
import Navbar from './Navbar';
import pintpalLogo from '../assets/pintpal-logo.png';
import { Link } from 'react-router-dom';

function Home() {
  // Verificar si existe un JWT_TOKEN en el localStorage
  const isAuthenticated = !!localStorage.getItem('JWT_TOKEN');

  return (
    <>
      {/* PintPal superior con el logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: 'black', fontSize: '2rem', fontWeight: 500 }}>PintPal</h2>
        <img src={pintpalLogo} alt="PintPal Logo" style={{ width: '50px', height: '50px', marginRight: '30px' }} />

        {/* SVG para Login/Logout */}
        <Link to={isAuthenticated ? '/logout' : '/login'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ cursor: 'pointer' }}
          >
            {isAuthenticated ? (
              // Icono de logout
              <path d="M9 21L3 12 9 3M3 12H21" />
            ) : (
              // Icono de login
              <>
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </>
            )}
          </svg>
        </Link>
      </div>

      {/* Tarjeta que lleva al index de bars (/bars) */}
      <div id='barsHomeCard' style={{ marginTop: '20px', minWidth: '300px', maxWidth: '300px' }}>
        <BarsHomeCard />
      </div>

      {/* Tarjeta que lleva al index de beers (/beers) */}
      <div id='beersHomeCard' style={{ marginTop: '20px', minWidth: '300px', maxWidth: '300px' }}>
        <BeersHomeCard />
      </div>

      {/* Tarjeta que lleva al index de social (/social) */}
      <div id='socialHomeCard' style={{ marginTop: '20px', minWidth: '300px', maxWidth: '300px' }}>
        <SocialHomeCard />
      </div>
    </>
  );
}

export default Home;
