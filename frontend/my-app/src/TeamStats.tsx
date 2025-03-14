import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Optionally, define types for your team stats data.
// For simplicity, we're using "any" here.
interface TeamStat {
  team: {
    name: string;
    // ... add more properties as needed
  };
  fixtures: {
    played: { home: number; away: number; total: number };
    wins: { home: number; away: number; total: number };
    draws: { home: number; away: number; total: number };
    loses: { home: number; away: number; total: number };
  };
  goals: {
    for: {
      total: { home: number; away: number; total: number };
      average: { home: string; away: string; total: string };
      // ... other nested properties if needed
    };
    against: {
      total: { home: number; away: number; total: number };
      average: { home: string; away: string; total: string };
      // ... other nested properties if needed
    };
  };
}

const TeamStats: React.FC = () => {
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    axios
      .get<TeamStat[]>('http://localhost:3000/get-teamStats-json')
      .then((response) => {
        setTeamStats(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch team stats');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading team stats...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {teamStats.map((stat, index) => (
        <div key={index} style={{ margin: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h2>{stat.team.name}</h2>

          {/* Fixtures Stats */}
          <section style={{ marginBottom: '1.5rem' }}>
            <h3>Fixtures</h3>
            <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th></th>
                  <th>Home</th>
                  <th>Away</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Played</td>
                  <td>{stat.fixtures.played.home}</td>
                  <td>{stat.fixtures.played.away}</td>
                  <td>{stat.fixtures.played.total}</td>
                </tr>
                <tr>
                  <td>Wins</td>
                  <td>{stat.fixtures.wins.home}</td>
                  <td>{stat.fixtures.wins.away}</td>
                  <td>{stat.fixtures.wins.total}</td>
                </tr>
                <tr>
                  <td>Draws</td>
                  <td>{stat.fixtures.draws.home}</td>
                  <td>{stat.fixtures.draws.away}</td>
                  <td>{stat.fixtures.draws.total}</td>
                </tr>
                <tr>
                  <td>Losses</td>
                  <td>{stat.fixtures.loses.home}</td>
                  <td>{stat.fixtures.loses.away}</td>
                  <td>{stat.fixtures.loses.total}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Goals Stats */}
          <section>
            <h3>Goals</h3>
            {/* Goals For */}
            <h4>Goals For</h4>
            <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th></th>
                  <th>Home</th>
                  <th>Away</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Scored</td>
                  <td>{stat.goals.for.total.home}</td>
                  <td>{stat.goals.for.total.away}</td>
                  <td>{stat.goals.for.total.total}</td>
                </tr>
                <tr>
                  <td>Average</td>
                  <td>{stat.goals.for.average.home}</td>
                  <td>{stat.goals.for.average.away}</td>
                  <td>{stat.goals.for.average.total}</td>
                </tr>
              </tbody>
            </table>

            {/* Goals Against */}
            <h4 style={{ marginTop: '1rem' }}>Goals Against</h4>
            <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th></th>
                  <th>Home</th>
                  <th>Away</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Conceded</td>
                  <td>{stat.goals.against.total.home}</td>
                  <td>{stat.goals.against.total.away}</td>
                  <td>{stat.goals.against.total.total}</td>
                </tr>
                <tr>
                  <td>Average</td>
                  <td>{stat.goals.against.average.home}</td>
                  <td>{stat.goals.against.average.away}</td>
                  <td>{stat.goals.against.average.total}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      ))}
    </div>
  );
};

export default TeamStats;
