import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import PredictionPage from './PredictionPage';
import Navbar from './Navbar';
import PremierLeagueTable from './PremierLeagueTable';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        
          <Route path="/" element={<PremierLeagueTable />} />
          <Route path="/prediction" element={<PredictionPage />} />

      </BrowserRouter>
    </div>
  );
}

export default App;
