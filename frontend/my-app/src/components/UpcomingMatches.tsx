import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpcomingMatches.css';

interface Match {
  id: number;
  utcDate: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
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
    const date = new Date(match.utcDate);
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
    axios.get('http://localhost:3000/getUpcomingMatches')
      .then(response => setMatches(response.data.matches))
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
              <div key={match.id} className="match-card">
                <div className="match-info">
                  <span className="match-time">{formatTime(match.utcDate)}</span>
                  <div className="teams">
                    <span className="team">{match.homeTeam.name}</span>
                    <span className="vs">vs</span>
                    <span className="team">{match.awayTeam.name}</span>
                  </div>
                </div>
                <div className="odds-container">
                  {[1, 2, 3].map((_, index) => (
                    <button
                      key={index}
                      className={`odds-btn ${selectedOdds[match.id] === index ? 'selected' : ''}`}
                      onClick={() => handleOddsSelect(match.id, index)}
                    >
                      3.00
                    </button>
                  ))}
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