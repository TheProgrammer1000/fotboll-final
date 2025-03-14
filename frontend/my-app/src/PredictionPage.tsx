// PredictionPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PredictionPage.css';

interface TableTeam {
  id: number;
  name: string;
  logo: string;
  played: number;
  wins: number;
  drawn: number;
  lost: number;
  gf: number;   // goals for (total)
  ga: number;   // goals against (total)
  gd: number;   // goal difference
  points: number;
}

const PredictionPage: React.FC = () => {
  const [teams, setTeams] = useState<TableTeam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [teamAId, setTeamAId] = useState<number | null>(null);
  const [teamBId, setTeamBId] = useState<number | null>(null);
  const [result, setResult] = useState<{ probA: number; probB: number } | null>(null);

  useEffect(() => {
    axios
      .get('http://localhost:3000/get-teamStats-json')
      .then((response) => {
        const rawTeams = response.data;
        // Transform raw data into a simpler shape for prediction
        const transformed: TableTeam[] = rawTeams.map((item: any) => {
          const played = item.fixtures.played.total;
          const wins = item.fixtures.wins.total;
          const drawn = item.fixtures.draws.total;
          const lost = item.fixtures.loses.total;
          const gf = item.goals.for.total.total;
          const ga = item.goals.against.total.total;
          const gd = gf - ga;
          // Points: 3 per win and 1 per draw
          const points = wins * 3 + drawn;
          return {
            id: item.team.id,
            name: item.team.name,
            logo: item.team.logo,
            played,
            wins,
            drawn,
            lost,
            gf,
            ga,
            gd,
            points,
          };
        });
        // Sort alphabetically (for easier selection)
        transformed.sort((a, b) => a.name.localeCompare(b.name));
        setTeams(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching team stats');
        setLoading(false);
      });
  }, []);

  // Simple rating function: rating = points + (goal difference / 2)
  const computeRating = (team: TableTeam) => {
    return team.points + team.gd / 2;
  };

  const calculateProbabilities = () => {
    if (teamAId === null || teamBId === null) return;
    const teamA = teams.find((t) => t.id === teamAId);
    const teamB = teams.find((t) => t.id === teamBId);
    if (!teamA || !teamB) return;
    const ratingA = computeRating(teamA);
    const ratingB = computeRating(teamB);
    const total = ratingA + ratingB;
    const probA = total > 0 ? (ratingA / total) * 100 : 50;
    const probB = total > 0 ? (ratingB / total) * 100 : 50;
    setResult({ probA, probB });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="prediction-page-container">
      <h1>Match Prediction</h1>
      <div className="dropdowns">
        <div>
          <label htmlFor="teamA">Team A:</label>
          <select
            id="teamA"
            onChange={(e) => setTeamAId(Number(e.target.value))}
            value={teamAId || ''}
          >
            <option value="" disabled>
              Select Team A
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="teamB">Team B:</label>
          <select
            id="teamB"
            onChange={(e) => setTeamBId(Number(e.target.value))}
            value={teamBId || ''}
          >
            <option value="" disabled>
              Select Team B
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button onClick={calculateProbabilities} disabled={!teamAId || !teamBId}>
        Calculate Prediction
      </button>
      {result && (
        <div className="result">
          <h2>Prediction</h2>
          <p>Team A Win Chance: {result.probA.toFixed(2)}%</p>
          <p>Team B Win Chance: {result.probB.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
