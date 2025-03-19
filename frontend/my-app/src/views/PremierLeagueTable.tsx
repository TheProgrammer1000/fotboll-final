import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PremierLeagueTable.css';

interface TableTeam {
  id: number;
  position: number;
  name: string;
  logo: string;
  played: number;
  wins: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
  winsHome: number;
  winsAway: number;
  goalsForHome: number;
  goalsForAway: number;
}

const PremierLeagueTable: React.FC = () => {
  const [teams, setTeams] = useState<TableTeam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/get-fetch-teamStats-json')
      .then((response) => {
        const transformed = response.data.map((item: any, index: number) => ({
          id: item.team.id,
          position: index + 1,
          name: item.team.name,
          logo: item.team.logo,
          played: item.fixtures.played.total,
          wins: item.fixtures.wins.total,
          drawn: item.fixtures.draws.total,
          lost: item.fixtures.loses.total,
          gf: item.goals.for.total.total,
          ga: item.goals.against.total.total,
          points: item.fixtures.wins.total * 3 + item.fixtures.draws.total,
          winsHome: item.fixtures.wins.home,
          winsAway: item.fixtures.wins.away,
          goalsForHome: item.goals.for.total.home,
          goalsForAway: item.goals.for.total.away,
        })).sort((a: TableTeam, b: TableTeam) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));
        
        setTeams(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch team stats');
        setLoading(false);
      });
  }, []);

  const toggleExpand = (teamId: number) => {
    setExpandedTeamId(prev => prev === teamId ? null : teamId);
  };

  if (loading) return <div className="loading">Loading Premier League Table...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="league-container">
      <h2 className="league-title">Premier League Standings</h2>
      <div className="table-wrapper">
        <table className="league-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Club</th>
              <th>PL</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <React.Fragment key={team.id}>
                <tr onClick={() => toggleExpand(team.id)} className="table-row">
                  <td className="position">{index + 1}</td>
                  <td className="club">
                    <img src={team.logo} alt={team.name} />
                    <span>{team.name}</span>
                  </td>
                  <td>{team.played}</td>
                  <td>{team.wins}</td>
                  <td>{team.drawn}</td>
                  <td>{team.lost}</td>
                  <td>{team.gf}</td>
                  <td>{team.ga}</td>
                  <td className="points">{team.points}</td>
                </tr>
                {expandedTeamId === team.id && (
                  <tr className="expanded">
                    <td colSpan={9}>
                      <div className="expanded-content">
                        <div className="stats-grid">
                          <div className="stat-item">
                            <h4>Home Wins</h4>
                            <p>{team.winsHome}</p>
                          </div>
                          <div className="stat-item">
                            <h4>Away Wins</h4>
                            <p>{team.winsAway}</p>
                          </div>
                          <div className="stat-item">
                            <h4>Home Goals</h4>
                            <p>{team.goalsForHome}</p>
                          </div>
                          <div className="stat-item">
                            <h4>Away Goals</h4>
                            <p>{team.goalsForAway}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PremierLeagueTable;