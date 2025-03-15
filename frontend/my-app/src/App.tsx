import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PredictionPage from './PredictionPage';
import Navbar from './Navbar';
import PremierLeagueTable from './PremierLeagueTable';
// Import the new HeadToHeadPage
import HeadToHeadPage from './HeadToHeadPage';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<PremierLeagueTable />} />
          <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/head-to-head" element={<HeadToHeadPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
