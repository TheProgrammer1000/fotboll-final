// src/App.tsx

import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './views/HomePage';
import HeadToHeadPage from './views/HeadToHeadPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/head-to-head" element={<HeadToHeadPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
