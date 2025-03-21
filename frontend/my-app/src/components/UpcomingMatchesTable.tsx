import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpcomingMatchesTable.css';
import MatchOdds from './MatchOdds';

interface Match {
  FixtureID: string;
  HomeTeamID: number;
  HomeTeamName: string;
  AwayTeamID: number;
  AwayTeamName: string;
  FixtureDate: string;
  Bookmaker: string;
  OddsUpdateDate: string;
  max_odds1: string;
  max_oddsx: string;
  max_odds2: string;
  bookmaker_odds1: string;
  bookmaker_oddsx: string;
  bookmaker_odds2: string;
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

interface UpcomingMatchesProps {
  onMatchSelect: (teamIds: number[]) => void;
}

const UpcomingMatches: React.FC<UpcomingMatchesProps> = ({ onMatchSelect }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedOdds, setSelectedOdds] = useState<{ [key: string]: number }>({});
  const [expandedMatchIds, setExpandedMatchIds] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/matches/upcoming-matches')
      .then(response => {
        console.log(response.data);
        setMatches(response.data);
      })
      .catch(err => console.error('Error fetching matches:', err));
  }, []);

  const handleOddsSelect = (matchId: string, index: number) => {
    setSelectedOdds(prev => ({ ...prev, [matchId]: index }));
  };

  const handleMatchClick = (match: Match) => {
    // Toggle expansion for this match.
    setExpandedMatchIds(prev => {
      if (prev.includes(match.FixtureID)) {
        return prev.filter(id => id !== match.FixtureID);
      } else {
        return [...prev, match.FixtureID];
      }
    });
    onMatchSelect([match.HomeTeamID, match.AwayTeamID]);
  };

  return (
    <div className="matches-container">
      <h2 className="matches-title">Upcoming Matches</h2>
      {Object.entries(groupMatchesByDate(matches)).map(([date, matches]) => (
        <div key={date} className="date-group">
          <div className="date-header">{date}</div>
          <div className="matches-list">
            {matches.map(match => {
              const oddsData = [
                { oddValue: match.max_odds1, bookmaker: match.bookmaker_odds1 },
                { oddValue: match.max_oddsx, bookmaker: match.bookmaker_oddsx },
                { oddValue: match.max_odds2, bookmaker: match.bookmaker_odds2 },
              ];

              const isExpanded = expandedMatchIds.includes(match.FixtureID);

              return (
                <div key={match.FixtureID} className="match-card">
                  {/* The entire match-info row is clickable */}
                  <div className="match-info" onClick={() => handleMatchClick(match)}>
                    <div className="match-main">
                      <span className="match-time">{formatTime(match.FixtureDate)}</span>
                      <div className="teams">
                        <span className="team">{match.HomeTeamName}</span>
                        <span className="vs">vs</span>
                        <span className="team">{match.AwayTeamName}</span>
                      </div>
                    </div>
                    {/* Odds container gets a highlight class if expanded */}
                    <div className={`odds-container ${isExpanded ? 'highlight' : ''}`}>
                      {oddsData.map((item, index) => {
                        const numericOdd = parseFloat(item.oddValue);
                        return (
                          <button
                            key={index}
                            className={`odds-btn ${
                              selectedOdds[match.FixtureID] === index ? 'selected' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOddsSelect(match.FixtureID, index);
                            }}
                          >
                            <div className="odds-text">
                              {!isNaN(numericOdd) ? numericOdd.toFixed(2) : 'N/A'}
                              <span className="odds-provider">{item.bookmaker}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expanded odds section below */}
                  {isExpanded && (
                    <div className="expanded-odds">
                      <MatchOdds fixtureID={match.FixtureID} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingMatches;
