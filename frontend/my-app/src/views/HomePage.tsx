import React from 'react';
import UpcomingMatches from '../components/UpcomingMatches'
import PremierLeagueTable from './PremierLeagueTable';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="homepage-container">
      {/* Header row with both titles */}
      <div className="header-row">
        {/* <h2>Upcoming Matches</h2>
        <h2>PREMIER LEAGUE</h2> */}
      </div>

      {/* Main content row with two columns */}
      <div className="content-row">
        <div className="left-column">
          <UpcomingMatches />
        </div>
        <div className="right-column">
          <PremierLeagueTable />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
