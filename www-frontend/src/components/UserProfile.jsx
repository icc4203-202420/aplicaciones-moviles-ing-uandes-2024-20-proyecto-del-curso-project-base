import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Asumimos que el ID del usuario se obtiene de algún contexto o de la autenticación
    const userId = 1; // Cambia esto según cómo obtienes el ID del usuario

    axios.get('/api/v1/users/${userId}')
      .then(response => {
        setUser(response.data.user);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-profile">
      {user ? (
        <div>
          <h1>User Profile</h1>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* Puedes agregar más detalles del perfil aquí */}
          {user.address && (
            <div>
              <h2>Address</h2>
              <p><strong>Line 1:</strong> {user.address.line1}</p>
              <p><strong>Line 2:</strong> {user.address.line2}</p>
              <p><strong>City:</strong> {user.address.city}</p>
              {user.address.country && (
                <p><strong>Country:</strong> {user.address.country.name}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}

export default User