import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpcomingMatchesTable.css';


// interface Match {
//   id: number;
//   utcDate: string;
//   homeTeam: { name: string };
//   awayTeam: { name: string };
// }

interface Match {
  FixtureID: string
  HomeTeamID: number
  HomeTeamName: string
  AwayTeamID: number
  AwayTeamName: string
  FixtureDate: string
  Bookmaker: string
  OddsUpdateDate: string
  Odds1: string
  OddsX: string
  Odds2: string
}



const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Stockholm'
  });
};

const groupMatchesByDate = (matches: Match[]) => {
  const groups: { [key: string]: Match[] } = {};
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' });
  const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' });

  matches.forEach(match => {
    const date = new Date(match.FixtureDate);
    const dateKey = date.toLocaleDateString('sv-SE', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/Stockholm'
    });
    
    let label = dateKey.charAt(0).toUpperCase() + dateKey.slice(1);
    if (date.toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' }) === today) {
      label = `Idag • ${label}`;
    } else if (date.toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' }) === tomorrow) {
      label = `Imorgon • ${label}`;
    }
    
    groups[label] = groups[label] || [];
    groups[label].push(match);
  });

  return groups;
};

const UpcomingMatches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedOdds, setSelectedOdds] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    axios.get('http://localhost:3000/matches/upcoming-matches')
      .then(response => {
        console.log(response.data);
        setMatches(response.data);
      })
      .catch(err => console.error('Error fetching matches:', err));
  }, []);

  const handleOddsSelect = (matchId: number, index: number) => {
    setSelectedOdds(prev => ({ ...prev, [matchId]: index }));
  };

  return (
    <div className="matches-container">
      <h2 className="matches-title">Upcoming Matches</h2>
      {Object.entries(groupMatchesByDate(matches)).map(([date, matches]) => (
        <div key={date} className="date-group">
          <div className="date-header">{date}</div>
          <div className="matches-list">
            {matches.map(match => (
              <div key={match.FixtureID} className="match-card">
                <div className="match-info">
                  <span className="match-time">{formatTime(match.FixtureDate)}</span>
                  <div className="teams">
                    <span className="team">{match.HomeTeamName}</span>
                    <span className="vs">vs</span>
                    <span className="team">{match.AwayTeamName}</span>
                  </div>
                </div>
                <div className="odds-container">
                  {[match.Odds1, match.OddsX, match.Odds2].map((odd: any, index) => {
                    const numericOdd = parseFloat(odd);
                    return (
                      <button
                        key={index}
                        className={`odds-btn ${selectedOdds[parseInt(match.FixtureID)] === index ? 'selected' : ''}`}
                        onClick={() => handleOddsSelect(parseInt(match.FixtureID), index)}
                      >
                        {!isNaN(numericOdd) ? numericOdd.toFixed(2) : 'N/A'}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingMatches;