import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import BarsList from './BarsList';
import BeersList from './BeersList';
import ProfilesList from './ProfilesList';
import SearchAppBar from './SearchAppBar';

function SearchTabs() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchKeywords, setSearchKeywords] = useState('');

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSearchKeywords(''); // Clear search when switching tabs
  };

  return (
    <Box sx={{ width: '100%' }}>
      <SearchAppBar searchKeywords={searchKeywords} setSearchKeywords={setSearchKeywords} />

      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Bares" />
        <Tab label="Cervezas" />
        <Tab label="Personas" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {selectedTab === 0 && <BarsList searchKeywords={searchKeywords} />}
        {selectedTab === 1 && <BeersList searchKeywords={searchKeywords} />}
        {selectedTab === 2 && <ProfilesList searchKeywords={searchKeywords} />}
      </Box>
    </Box>
  );
}

export default SearchTabs;
