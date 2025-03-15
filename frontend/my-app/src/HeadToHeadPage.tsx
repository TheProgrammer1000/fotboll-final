import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the interface for the fixture data
interface HeadToHeadFixture {
  fixture: {
    id: number;
    referee: string;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
      extra: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
    standings: boolean;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
    away: {
      id: number;
      name: string;
      logo: string;
      winner: boolean | null;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: {
      home: number | null;
      away: number | null;
    };
    fulltime: {
      home: number | null;
      away: number | null;
    };
    extratime: {
      home: number | null;
      away: number | null;
    };
    penalty: {
      home: number | null;
      away: number | null;
    };
  };
}

interface teamResult {
    draw: number;
    lossesAway: number;
    lossesHome: number;
    name: string;
    totalWins: number;
    winsAway: number;
    winsHome: number;
}

// Define a simple Team interface for dropdowns
interface Team {
  id: number;
  name: string;
  logo: string;
}

const HeadToHeadPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam1, setSelectedTeam1] = useState<number | ''>('');
  const [selectedTeam2, setSelectedTeam2] = useState<number | ''>('');
  const [fixtures, setFixtures] = useState<HeadToHeadFixture[]>([]);


  const [team1Result, setTeam1Result] = useState<teamResult>();
  const [team2Result, setTeam2Result] = useState<teamResult>();

  const [error, setError] = useState('');

  // Fetch team list for dropdowns
  useEffect(() => {
    axios
      .get('http://localhost:3000/get-fetch-teamStats-json')
      .then((res) => {
        // Map response data into Team objects
        const teamOptions: Team[] = res.data.map((item: any) => ({
          id: item.team.id,
          name: item.team.name,
          logo: item.team.logo,
        }));
        setTeams(teamOptions);
      })
      .catch(() => {
        setError('Failed to load teams');
      });
  }, []);

  // Handle submission to fetch head-to-head fixture(s)
  const handleSubmit = () => {
    if (!selectedTeam1 || !selectedTeam2 || selectedTeam1 === selectedTeam2) {
      setError('Please select two different teams');
      return;
    }
    setError('');
    axios
      .get(`http://localhost:3000/head-to-head/${selectedTeam1}/${selectedTeam2}`)
      .then((res) => {
        // If res.data is not an array, wrap it in an array
        const data = res.data;
        const fixturesArray = Array.isArray(data) ? data : [data];

        console.log('fixturesArray:', fixturesArray[0]);

        setTeam1Result(fixturesArray[0].team1);
        setTeam2Result(fixturesArray[0].team2)
    
        setFixtures(fixturesArray[0].matches);


      })
      .catch(() => {
        setError('Failed to load fixtures');
      });
  };

  return (


    <div style={{ padding: '1rem' }}>
      <h2>Head to Head Fixtures</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {/* Team selection dropdowns */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Team 1: </label>
        <select
          value={selectedTeam1}
          onChange={(e) => setSelectedTeam1(Number(e.target.value))}
        >
          <option value="">Select a Team</option>
          {teams.map((team) => (
            <option key={`team1-${team.id}`} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Team 2: </label>
        <select
          value={selectedTeam2}
          onChange={(e) => setSelectedTeam2(Number(e.target.value))}
        >
          <option value="">Select a Team</option>
          {teams.map((team) => (
            <option key={`team2-${team.id}`} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit}>Show Fixtures</button>
      {/* Display the fixture(s) in a card layout */}
      <div style={{ marginTop: '1rem' }}>
        {fixtures.map((fixture, index) => {
          const uniqueKey = `${fixture.fixture.id}-${index}`;
          return (
            <div
              key={uniqueKey}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h3>
                {fixture.league.name} - {fixture.league.round}
              </h3>
              <p>
                <strong>Date:</strong>{' '}
                {new Date(fixture.fixture.date).toLocaleString()}
              </p>
              <p>
                <strong>Venue:</strong> {fixture.fixture.venue.name},{' '}
                {fixture.fixture.venue.city}
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  marginTop: '1rem',
                }}
              >
                {/* Home team */}
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={fixture.teams.home.logo}
                    alt={fixture.teams.home.name}
                    style={{ width: '50px' }}
                  />
                  <p>{fixture.teams.home.name}</p>
                </div>
                {/* Score */}
                <div style={{ fontSize: '1.5rem' }}>
                  {fixture.goals.home} : {fixture.goals.away}
                </div>
                {/* Away team */}
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={fixture.teams.away.logo}
                    alt={fixture.teams.away.name}
                    style={{ width: '50px' }}
                  />
                  <p>{fixture.teams.away.name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeadToHeadPage;
