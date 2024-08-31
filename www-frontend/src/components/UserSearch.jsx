import React, { useState } from 'react';

function UserSearch() {
  const [handle, setHandle] = useState('');

  return (
    <div>
      <h2>Search Users</h2>
      <input
        type="text"
        placeholder="Enter user handle"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      <button onClick={() => {/* Implement search functionality here */}}>
        Search
      </button>
    </div>
  );
}

export default UserSearch;