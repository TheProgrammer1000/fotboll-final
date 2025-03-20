// HomePage.tsx
import React from 'react';
import FootballDashboard from '../components/FootballDashboard';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      <FootballDashboard />
    </div>
  );
};

export default HomePage;
