import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PremierLeagueTable.css';
import TableTeam from './interface/TableTeam';
import TabNavigation from './TabNavigation';

const PremierLeagueTable: React.FC = () => {
  const [teams, setTeams] = useState<TableTeam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);
  const [recentMatches, setRecentMatches] = useState<Record<number, any[]>>({});
  const [matchesLoading, setMatchesLoading] = useState<boolean>(false);

  useEffect(() => {
    axios.get('http://localhost:3000/team-stats')
      .then((response) => {
        const teamsStats: TableTeam[] = response.data;
        teamsStats.sort((a: TableTeam, b: TableTeam) => b.Points - a.Points);
        setTeams(teamsStats);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch team stats');
        setLoading(false);
      });
  }, []);

  const toggleExpand = (teamId: number) => {
    // Collapse if already expanded
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
      return;
    }
    setExpandedTeamId(teamId);

    // Fetch recent matches only if they haven't been fetched yet.
    if (!recentMatches[teamId]) {
      setMatchesLoading(true);
      axios.get(`http://localhost:3000/matches/recently-played/${teamId}`)
        .then((response) => {
          setRecentMatches(prev => ({
            ...prev,
            [teamId]: response.data
          }));
          setMatchesLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setMatchesLoading(false);
        });
    }
  };

  if (loading) return <div className="loading">Loading Premier League Table...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="league-container">
      <h2 className="league-title">Premier League Standings</h2>
      <TabNavigation teams={teams} updateTeams={setTeams} />
      <div className="table-wrapper">
        <table className="league-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Premier League</th>
              <th>S</th>
              <th>V</th>
              <th>O</th>
              <th>F</th>
              <th style={{ textAlign: 'center'}}>Mål</th>
              <th>D</th>
              <th>P</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <React.Fragment key={team.TeamsID}>
                <tr  
                    onClick={() => toggleExpand(team.TeamsID)}
                    className="table-row"
                  >
                  <td className="position">{index + 1}</td>
                  <td className="club">
                    <img src={team.TeamsLogo} alt={team.TeamsName} />
                    <span>{team.TeamsName || 'Unknown Team'}</span>
                  </td>
                  <td>{team.PlayedTotal}</td>
                  <td>{team.PlayedWinsTotal}</td>
                  <td>{team.PlayedDrawsTotal}</td>
                  <td>{team.PlayedLosesTotal}</td>
                  <td style={{ textAlign: 'center'}}>
                    {team.PlayedGoalsTotal} - {team.PlayedGoalsAgainstTotal}
                  </td>
                  <td>{team.GoalsDiff}</td>
                  <td className="points">{team.Points}</td>
                </tr>

                {expandedTeamId === team.TeamsID && (
                  <tr className="expanded">
                    <td colSpan={9}>
                      <div className="expanded-content">
                        {matchesLoading ? (
                          <div>Loading recent matches...</div>
                        ) : (
                          recentMatches[team.TeamsID] && recentMatches[team.TeamsID].length > 0 ? (
                            <table className="recent-matches-table">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Home</th>
                                  <th>Score</th>
                                  <th>Away</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recentMatches[team.TeamsID].map((match: any, idx: number) => (
                                  <tr key={idx}>
                                    <td>{new Date(match.FixtureDate).toLocaleDateString('sv-SE', { timeZone: 'Europe/Stockholm' })}</td>
                                    <td>{match.HomeTeamName}</td>
                                    <td>{match.GoalsHome} - {match.GoalsAway}</td>
                                    <td>{match.AwayTeamName}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div>No recent matches available.</div>
                          )
                        )}
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
