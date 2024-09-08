import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FixedBottomNav from './components/FixedBottomNav';
import SearchTabs from './components/SearchTabs';
import BarDetails from './components/BarDetails';

function App() {
  return (
    <>
      <FixedBottomNav />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchTabs />} />
        <Route path="/bars/:barId" element={<BarDetails />} />
<<<<<<< HEAD
        <Route path="/beers/:beerId" element={<BeerDetails />} />
        
=======
>>>>>>> parent of afc515c (feat: fixed searchbar)
      </Routes>
    </>
  );
}

export default App;
