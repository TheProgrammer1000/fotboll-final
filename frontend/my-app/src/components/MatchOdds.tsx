import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MatchOdds.css'; // Import the dedicated CSS

interface OddsData {
  FixtureID: number;
  HomeTeamID: number;
  HomeTeamName: string;
  AwayTeamID: number;
  AwayTeamName: string;
  FixtureDate: string;
  Bookmaker: string;
  OddsUpdateDate: string;
  bookmaker_odds1: string;
  bookmaker_oddsx: string;
  bookmaker_odds2: string;
}

interface MatchOddsProps {
  fixtureID: string;
}

const MatchOdds: React.FC<MatchOddsProps> = ({ fixtureID }) => {
  const [oddsData, setOddsData] = useState<OddsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get<OddsData[]>(`http://localhost:3000/matches/upcoming-match/odds/${fixtureID}`)
      .then(response => {
        setOddsData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching match odds:', err);
        setError('Could not load odds');
        setLoading(false);
      });
  }, [fixtureID]);

  if (loading) return <div>Loading odds...</div>;
  if (error) return <div>{error}</div>;
  if (!oddsData.length) return <div>No odds data found.</div>;

  return (
    <div className="expanded-odds-container">
      <table className="match-odds-table">
        <thead>
          <tr>
            <th>Bookmaker</th>
            <th>1</th> 
            <th>X</th>
            <th>2</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {oddsData.map((odds, index) => {
            // Create a Swedish formatted date string and time string.
            const updatedDate = new Date(odds.OddsUpdateDate);
            const dateString = updatedDate.toLocaleDateString('sv-SE', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });
            const timeString = updatedDate.toLocaleTimeString('sv-SE', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'Europe/Stockholm'
            });
            return (
              <tr key={`${odds.Bookmaker}-${index}`}>
                <td>{odds.Bookmaker}</td>
                <td>{odds.bookmaker_odds1}</td>
                <td>{odds.bookmaker_oddsx}</td>
                <td>{odds.bookmaker_odds2}</td>
                <td>{`${dateString} ${timeString}`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MatchOdds;
