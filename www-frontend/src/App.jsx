import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import BeerList from './components/BeerList';
import BarList from './components/BarList';
import BarEvents from './components/BarEvents';
import UserSearch from './components/UserSearch';

function App() {
  return (
    <Router>
      <header className="header">
        <h1>Beer Explorer</h1>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beers" element={<BeerList />} />
        <Route path="/bars" element={<BarList />} />
        <Route path="/bars/:id/events" element={<BarEvents />} />
        <Route path="/search" element={<UserSearch />} />
      </Routes>
    </Router>
  );
}

export default App;