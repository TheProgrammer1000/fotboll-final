// PremierLeagueTable.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PremierLeagueTable.css';
import TableTeam from './interface/TableTeam';
import TabNavigation from './TabNavigation';

interface PremierLeagueTableProps {
  highlightedTeamIds?: number[];
}

const PremierLeagueTable: React.FC<PremierLeagueTableProps> = ({ highlightedTeamIds = [] }) => {
  const [teams, setTeams] = useState<TableTeam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [expandedTeamIds, setExpandedTeamIds] = useState<number[]>([]);
  const [recentMatches, setRecentMatches] = useState<Record<string, any[]>>({});
  const [matchesLoading, setMatchesLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('Sammanlagt');

  // When active tab changes, update recent matches for any expanded teams.
  useEffect(() => {
    expandedTeamIds.forEach((teamId) => {
      const key = `${teamId}-${activeTab}`;
      let fetchUrl = '';
      if (activeTab === 'Sammanlagt') {
        fetchUrl = `http://localhost:3000/matches/recently-played/total/${teamId}`;
      } else if (activeTab === 'Hemma') {
        fetchUrl = `http://localhost:3000/matches/recently-played/home/${teamId}`;
      } else if (activeTab === 'Borta') {
        fetchUrl = `http://localhost:3000/matches/recently-played/away/${teamId}`;
      }
      axios.get(fetchUrl)
        .then((response) => {
          setRecentMatches((prev) => ({
            ...prev,
            [key]: response.data,
          }));
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }, [activeTab, expandedTeamIds]);

  // Create a map from team ID to logo URL.
  const logoMap = React.useMemo(() => {
    const map: Record<number, string> = {};
    teams.forEach((t) => {
      map[t.TeamsID] = t.TeamsLogo;
    });
    return map;
  }, [teams]);

  // Fetch team stats.
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
    const isExpanded = expandedTeamIds.includes(teamId);
    if (isExpanded) {
      setExpandedTeamIds(expandedTeamIds.filter(id => id !== teamId));
    } else {
      setExpandedTeamIds([...expandedTeamIds, teamId]);
      const key = `${teamId}-${activeTab}`;
      if (!recentMatches[key]) {
        let fetchUrl = '';
        if (activeTab === 'Sammanlagt') {
          fetchUrl = `http://localhost:3000/matches/recently-played/total/${teamId}`;
        } else if (activeTab === 'Hemma') {
          fetchUrl = `http://localhost:3000/matches/recently-played/home/${teamId}`;
        } else if (activeTab === 'Borta') {
          fetchUrl = `http://localhost:3000/matches/recently-played/away/${teamId}`;
        }
        setMatchesLoading(true);
        axios.get(fetchUrl)
          .then((response) => {
            setRecentMatches(prev => ({
              ...prev,
              [key]: response.data,
            }));
            setMatchesLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setMatchesLoading(false);
          });
      }
    }
  };

  if (loading) return <div className="loading">Loading Premier League Table...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="league-container">
      <h2 className="league-title">Premier League Standings</h2>
      <TabNavigation teams={teams} updateTeams={setTeams} activeTab={activeTab} setActiveTab={setActiveTab} />
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
              <th style={{ textAlign: 'center' }}>Mål</th>
              <th>D</th>
              <th>P</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => {
              const isHighlighted = highlightedTeamIds.includes(team.TeamsID);
              return (
                <React.Fragment key={team.TeamsID}>
                  <tr
                    onClick={() => toggleExpand(team.TeamsID)}
                    className={`table-row ${isHighlighted ? 'highlight' : ''}`}
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
                    <td style={{ textAlign: 'center' }}>
                      {team.PlayedGoalsTotal} - {team.PlayedGoalsAgainstTotal}
                    </td>
                    <td>{team.GoalsDiff}</td>
                    <td className="points">{team.Points}</td>
                  </tr>
                  {expandedTeamIds.includes(team.TeamsID) && (
                    <tr className="expanded">
                      <td colSpan={9}>
                        <div className="expanded-content">
                          {matchesLoading ? (
                            <div>Loading recent matches...</div>
                          ) : (
                            (() => {
                              const key = `${team.TeamsID}-${activeTab}`;
                              const matches = recentMatches[key];
                              return matches && matches.length > 0 ? (
                                <table className="recent-matches-table">
                                  <thead>
                                    <tr>
                                      <th>Datum</th>
                                      <th>Hemma</th>
                                      <th>Result</th>
                                      <th>Borta</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {matches.map((match: any, idx: number) => (
                                      <tr key={idx}>
                                        <td>
                                          {new Date(match.FixtureDate).toLocaleDateString('sv-SE', {
                                            timeZone: 'Europe/Stockholm'
                                          })}
                                        </td>
                                        <td>
                                          <div className="team-cell">
                                            <img
                                              src={logoMap[match.HomeTeamID]}
                                              alt={match.HomeTeamName}
                                              className="team-logo"
                                            />
                                            <span>{match.HomeTeamName}</span>
                                          </div>
                                        </td>
                                        <td>{match.GoalsHome} - {match.GoalsAway}</td>
                                        <td>
                                          <div className="team-cell">
                                            <img
                                              src={logoMap[match.AwayTeamID]}
                                              alt={match.AwayTeamName}
                                              className="team-logo"
                                            />
                                            <span>{match.AwayTeamName}</span>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <div>No recent matches available.</div>
                              );
                            })()
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PremierLeagueTable;
