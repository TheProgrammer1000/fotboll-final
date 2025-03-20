// FootballDashboard.tsx
import React, { useState } from 'react';
import UpcomingMatches from '../components/UpcomingMatchesTable';
import PremierLeagueTable from '../components/PremierLeagueTable';
import '../views/HomePage.css';

const FootballDashboard: React.FC = () => {
  const [highlightedTeamIds, setHighlightedTeamIds] = useState<number[]>([]);

  const handleMatchSelect = (teamIds: number[]) => {
    setHighlightedTeamIds(teamIds);
  };

  return (
    <div className="homepage-container">
      <div className="content-row">
        <div className="left-column">
          <UpcomingMatches onMatchSelect={handleMatchSelect} />
        </div>
        <div className="right-column">
          <PremierLeagueTable highlightedTeamIds={highlightedTeamIds} />
        </div>
      </div>
    </div>
  );
};

export default FootballDashboard;
