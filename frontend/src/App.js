import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Apod from './pages/Apod';
import Epic from './pages/Epic';
import Neows from './pages/Neows';
import './App.css';
import { NasaDataProvider } from './context/DataContext';

function NavLinks() {
  const location = useLocation();
  return (
    <ul className="nav-links">
      <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
      <li><Link to="/apod" className={location.pathname === '/apod' ? 'active' : ''}>APOD</Link></li>
      <li><Link to="/epic" className={location.pathname === '/epic' ? 'active' : ''}>EPIC</Link></li>
      <li><Link to="/neows" className={location.pathname === '/neows' ? 'active' : ''}>NeoWs</Link></li>
    </ul>
  );
}

function App() {
  return (
    <Router>
      <NasaDataProvider>
        <div className="app-container">
          <div className="header">
            <h1>NASA Space Explorer</h1>
            <p>Discover the wonders of space through NASA's incredible data and imagery</p>
          </div>
          <nav className="navbar">
            <NavLinks />
          </nav>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/apod" element={<Apod />} />
              <Route path="/epic" element={<Epic />} />
              <Route path="/neows" element={<Neows />} />
            </Routes>
          </div>
        </div>
      </NasaDataProvider>
    </Router>
  );
}

export default App;
