import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './PremierLeagueTable.css';

// Register chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TableTeam {
  id: number;
  position: number;
  name: string;
  logo: string;
  played: number;
  wins: number;
  drawn: number;
  lost: number;
  gf: number;   // goals for (total)
  ga: number;   // goals against (total)
  points: number;
  // Additional details for expanded view:
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
    axios
      .get('http://localhost:3000/get-teamStats-json')
      .then((response) => {
        const rawTeams = response.data;
        // Transform the raw data into our TableTeam structure.
        let transformed: TableTeam[] = rawTeams.map((item: any, index: number) => {
          const played = item.fixtures.played.total;
          const wins = item.fixtures.wins.total;
          const drawn = item.fixtures.draws.total;
          const lost = item.fixtures.loses.total;
          const gf = item.goals.for.total.total;
          const ga = item.goals.against.total.total;
          // Simple points calculation: 3 per win, 1 per draw
          const points = wins * 3 + drawn;
          return {
            id: item.team.id,
            position: 0, // will set after sorting
            name: item.team.name,
            logo: item.team.logo,
            played,
            wins,
            drawn,
            lost,
            gf,
            ga,
            points,
            winsHome: item.fixtures.wins.home,
            winsAway: item.fixtures.wins.away,
            goalsForHome: item.goals.for.total.home,
            goalsForAway: item.goals.for.total.away,
          };
        });

        // Sort teams by points descending, then by goal difference if needed.
        transformed.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          const gdA = a.gf - a.ga;
          const gdB = b.gf - b.ga;
          return gdB - gdA;
        });

        // Set position based on sorted order
        transformed = transformed.map((team, index) => ({
          ...team,
          position: index + 1,
        }));

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
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
    }
  };

  if (loading) return <div>Loading Premier League Table...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="league-table-container">
      <h1 className="table-title">Premier League</h1>
      <table className="league-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Club</th>
            <th>Played</th>
            <th>Wins</th>
            <th>Drawn</th>
            <th>Lost</th>
            <th>GF</th>
            <th>GA</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <React.Fragment key={team.id}>
              <tr onClick={() => toggleExpand(team.id)} className="table-row">
                <td className="position-cell">{team.position}</td>
                <td className="club-cell">
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="club-logo"
                  />
                  <span>{team.name}</span>
                </td>
                <td>{team.played}</td>
                <td>{team.wins}</td>
                <td>{team.drawn}</td>
                <td>{team.lost}</td>
                <td>{team.gf}</td>
                <td>{team.ga}</td>
                <td className="points-cell">{team.points}</td>
              </tr>
              {expandedTeamId === team.id && (
                <tr className="expanded-row">
                  <td colSpan={9}>
                    <div className="expanded-content">
                      <h3>{team.name} Details</h3>
                      <p>
                        <strong>Wins:</strong> Home: {team.winsHome} | Away:{' '}
                        {team.winsAway}
                      </p>
                      <p>
                        <strong>Goals For:</strong> Home: {team.goalsForHome} | Away:{' '}
                        {team.goalsForAway}
                      </p>
                      
                   
                      {/* <div className="chart-container">
                        <Bar
                          data={{
                            labels: ['Home', 'Away'],
                            datasets: [
                              {
                                label: 'Wins',
                                data: [team.winsHome, team.winsAway],
                                backgroundColor: '#27a24f',
                              },
                              {
                                label: 'Goals For',
                                data: [team.goalsForHome, team.goalsForAway],
                                backgroundColor: '#1e90ff',
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: { position: 'top' },
                              title: {
                                display: true,
                                text: `${team.name} Wins & Goals`,
                              },
                            },
                          }}
                        />
                      </div> */}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PremierLeagueTable;
