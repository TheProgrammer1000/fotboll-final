import express, { Request, Response } from 'express';
import 'dotenv/config';
import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs';
import { config } from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';



const app = express();

const teamIdPath = './teamIds.json';
const teamStatsPath = './teamStats.json';
const leagueResultpath = './seasonResults.json'
const oddsOfSeasonPath = './oddsSeasonResult.json';



// interface TeamStats {
//   name: string;
//   winsHome: number;
//   winsAway: number;
//   lossesHome: number;
//   lossesAway: number;
//   totalWins: number;
//   draw: number;
//   formHome: number;
//   formAway: number;
//   avgGoalsHome: number;
//   avgGoalsAway: number;
//   formHomeRating: { category: string; description: string };
//   formAwayRating: { category: string; description: string };
// }


interface TeamStats {
  name: string;
  winsHome: number;
  winsAway: number;
  lossesHome: number;
  lossesAway: number;
  draw: number;
  totalWins: number;
}



let allTeamStats: any = [];
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:"], // Allow images from self and inline images if needed
      // Add other directives as necessary
    },
  })
);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



app.get('/fetch-team-ids', async (req: Request, res: Response) => {
  // first one is 33
  
  const config: AxiosRequestConfig = {
    method: 'get',
    url: 'https://v3.football.api-sports.io/teams?league=39&season=2024',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
    params: {
      
    },

    timeout: 5000
  };

  try {
    const response = await axios(config);

    console.log(response.data.response);

    await fs.promises.writeFile(teamIdPath, JSON.stringify(response.data.response, null, 2), 'utf-8');
    console.log("Successfully wrote to file!");

    res.json({ message: "File written successfully", data: response.data.response });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch leagues' });
  }
});


/* 
  This reading from the config.json file that should already be all the team and their ids!!!!!
*/
app.get('/fetch-teamStats', async (req: Request, res: Response) => {
  try {
    const fileContent = await fs.promises.readFile(teamIdPath, 'utf-8');
    const configData = JSON.parse(fileContent);

    
    const teamIdsFinal = configData.map((entry: any) => {
        return {
          "id": entry.team.id,
          "teamName": entry.team.name
        }
    });

    for(let i = 0; i < 9; i++) {
      console.log(teamIdsFinal[i].id);
      //console.log(teamIdsFinal[i].teamName)

        const config: AxiosRequestConfig = {
        method: 'get',
        url: `https://v3.football.api-sports.io/teams/statistics?league=39&season=2024&team=${teamIdsFinal[i].id}`,
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
        params: {
          
        }
      };
      
      try {
        const response = await axios(config);
        allTeamStats.push(response.data.response);
    
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Failed to fetch leagues' });
      }

      await sleep(2000);
    }
    
    console.log("zZzZzZzZzZzZz");
    await sleep(65000);

    for(let i = 9; i < 20; i++) {
      console.log(teamIdsFinal[i].id)
        

        const config: AxiosRequestConfig = {
        method: 'get',
        url: `https://v3.football.api-sports.io/teams/statistics?league=39&season=2024&team=${teamIdsFinal[i].id}`,
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
        params: {
          
        }
      };
      
      try {
        const response = await axios(config);
        allTeamStats.push(response.data.response);
    
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Failed to fetch leagues' });
      }

      await sleep(2000);
    }
    
    await fs.promises.writeFile('./teamStats.json', JSON.stringify(allTeamStats), 'utf-8');
    console.log("Successfully wrote to file!");

    // Respond only once after successfully writing to file.
    res.json({ message: "File written successfully", data: allTeamStats });

  } 
  catch (error) {
    console.error('Error reading or parsing file:', error);
    res.status(500).json({ message: 'Failed to retrieve team IDs' });
  }
});

app.get('/get-fetch-teamStats-json', async (req: Request, res: Response) => {
  try {

    const fileTeamsStats = await fs.promises.readFile(teamStatsPath, 'utf-8');
    const parseFileTeamsStats = JSON.parse(fileTeamsStats);
    //console.log("Successfully wrote to file!");

    // Respond only once after successfully writing to file.
    res.json(parseFileTeamsStats);
  } 
  catch (error) {
    console.error('Error reading or parsing file:', error);
    res.status(500).json({ message: 'Failed to retrieve team IDs' });
  }
});




// Helper function to delay execution for a given number of milliseconds.
//http://localhost:3000/head-to-head?team1=${selectedTeam1}&team2=${selectedTeam2}

app.get('/head-to-head/:firstId/:secoundId', async (req: Request, res: Response) => {
  const firstId = parseInt(req.params.firstId, 10);
  const secoundId = parseInt(req.params.secoundId, 10);

  try {
    // Read and parse the team IDs file
    const fileTeamId = await fs.promises.readFile(teamIdPath, 'utf-8');
    const parseFileTeamId = JSON.parse(fileTeamId);

    const teamIdsFinal = parseFileTeamId.map((entry: any) => ({
      id: entry.team.id,
      teamName: entry.team.name,
    }));

    // Check that both teams exist
    const team1 = teamIdsFinal.find((team: any) => team.id === firstId);
    const team2 = teamIdsFinal.find((team: any) => team.id === secoundId);

    if (!team1 || !team2) {
      return res.status(500).json({ message: 'Failed to fetch team by teamID' });
    }

    // Initialize team statistics with a new "draw" property
    let team1Final: Record<number, TeamStats> = {
      [team1.id]: {
        name: team1.teamName,
        winsHome: 0,
        winsAway: 0,
        lossesHome: 0,
        lossesAway: 0,
        draw: 0,
        totalWins: 0,
      },
    };

    let team2Final: Record<number, TeamStats> = {
      [team2.id]: {
        name: team2.teamName,
        winsHome: 0,
        winsAway: 0,
        lossesHome: 0,
        lossesAway: 0,
        draw: 0,
        totalWins: 0,
      },
    };

  

    let sortedMatchesTeam: any[] = [];

    try {
      const fileContent = await fs.promises.readFile(leagueResultpath, 'utf-8');
      console.log(fileContent);
      const matchesArray = JSON.parse(fileContent);
      console.log(matchesArray);

      // Filter matches between team1 and team2 with a valid result (status elapsed is not null)
      const filteredMatches = matchesArray.filter(
        (match: any) =>
          (match.teams.home.id === team1.id &&
            match.teams.away.id === team2.id) ||
          (match.teams.home.id === team2.id &&
            match.teams.away.id === team1.id)
      );

      sortedMatchesTeam.push(...filteredMatches);
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error reading or parsing ${leagueResultpath}:`, err.message);
      } else {
        console.error(`Unknown error reading or parsing ${leagueResultpath}:`, err);
      }
    }


    const sinceSeason = 2011;

    // Variable to store how many matches the two teams played together
    const matchesPlayedTogether = sortedMatchesTeam.length;

    // Update team statistics based on each match result
    for (const match of sortedMatchesTeam) {
      if (match.teams.home.id === team1.id) {
        if (match.teams.home.winner === true) {
          // Team1 wins at home
          team1Final[team1.id].totalWins++;
          team1Final[team1.id].winsHome++;
          team2Final[team2.id].lossesAway++;
        } else if (match.teams.home.winner === false) {
          // Team2 wins away
          team1Final[team1.id].lossesHome++;
          team2Final[team2.id].winsAway++;
          team2Final[team2.id].totalWins++;
        } else {
          // Draw: update draw property for both teams
          team1Final[team1.id].draw++;
          team2Final[team2.id].draw++;
        }
      } else if (match.teams.home.id === team2.id) {
        if (match.teams.home.winner === true) {
          // Team2 wins at home
          team2Final[team2.id].winsHome++;
          team2Final[team2.id].totalWins++;
          team1Final[team1.id].lossesAway++;
        } else if (match.teams.home.winner === false) {
          // Team1 wins away
          team2Final[team2.id].lossesHome++;
          team1Final[team1.id].winsAway++;
          team1Final[team1.id].totalWins++;
        } else {
          // Draw: update draw property for both teams
          team2Final[team2.id].draw++;
          team1Final[team1.id].draw++;
        }
      }
    }

    //sortedMatchesTeam.reverse();


    res.status(200).json({
      team1: team1Final[team1.id],
      team2: team2Final[team2.id],
      matches: sortedMatchesTeam,
      matchesPlayedTogether,
      sinceSeason
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error('An error occurred:', err.message);
    } else {
      console.error('An unknown error occurred:', err);
    }
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});




app.get('/fetch-all-seasons-results', async (req: Request, res: Response) => {
  //https://v3.football.api-sports.io/fixtures?league=39&season=2024&status=FT-AET-PEN

  let premierLeagueResults: any = [];

  
  try {

    for(let seasonNumber = 2011; seasonNumber <= 2024; seasonNumber++) {
      const config: AxiosRequestConfig = {
        method: 'get',
        url: `https://v3.football.api-sports.io/fixtures?league=39&season=${seasonNumber}&status=FT-AET-PEN`,
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'v3.football.api-sports.io',
        },
        params: {
          
        },
    
        timeout: 5000
      };
    
    
        const response = await axios(config);
    
        for(let i = 0; i < response.data.response.length; i++) {
          premierLeagueResults.push(response.data.response[i]);
        }

  
        await sleep(5500);
    }
  
    premierLeagueResults.reverse();

    await fs.promises.writeFile(leagueResultpath, JSON.stringify(premierLeagueResults, null, 2), 'utf-8');
    console.log("Successfully wrote to file!");

    res.json({ message: "File written successfully", data: premierLeagueResults});
    
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch leagues' });
  }

});



app.get('/getOdds/:season', async (req: Request, res: Response) => {
  const seasonQueryParameter = parseInt(req.params.season, 10);


  const config: AxiosRequestConfig = {
    method: 'get',
    url: `https://v3.football.api-sports.io/odds?league=39&season=${seasonQueryParameter}`,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
    params: {
      
    },

    timeout: 5000
  };

  try {
    const response = await axios(config);

    await fs.promises.writeFile(oddsOfSeasonPath, JSON.stringify(response.data.response, null, 2), 'utf-8');
    console.log("Successfully wrote to file!");

    

    res.json({ message: "File written successfully", data: response.data.response});

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch leagues' });
  }
  // await fs.promises.writeFile('./teamStats.json', 'Tjaba', 'utf-8');
  // console.log("Successfully wrote to file!");
});


app.get('/getOdds-from-json', async (req: Request, res: Response) => {

  try {

    const oddsOfSeasonREsult = await fs.promises.readFile(oddsOfSeasonPath, 'utf-8');
    const parseOddsOfSeasonREsult = JSON.parse(oddsOfSeasonREsult);

    res.json({ data: parseOddsOfSeasonREsult});

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch leagues' });
  }
});

app.get('/', async (req: Request, res: Response) => {
  // await fs.promises.writeFile('./teamStats.json', 'Tjaba', 'utf-8');
  // console.log("Successfully wrote to file!");

  res.status(200).send('Helllo');

});




/*
  Included both home and away statistics for both teams

  Added advanced metrics:
        Form points (3 for win, 1 for draw)
        Average goals scored
        Last 5 matches performance

    Maintained the original response structure while adding new fields

The response will now include:

    Traditional stats (wins/losses/draws)

    Form points (average points per match in last 5 home/away matches)

    Average goals scored in last 5 home/away matches

    Full match history between the teams



*/

app.get('/form-rating-guide', (req: Request, res: Response) => {
  const guide = {
    description: "Form ratings based on average points from last 5 matches (3=win, 1=draw, 0=loss)",
    ratings: [
      { range: "2.5-3.0", category: "Exceptional", description: "4-5 wins" },
      { range: "2.0-2.4", category: "Strong", description: "3-4 wins" },
      { range: "1.5-1.9", category: "Average", description: "1-2 wins" },
      { range: "1.0-1.4", category: "Below Average", description: "0-1 wins" },
      { range: "0.0-0.9", category: "Poor", description: "0 wins" }
    ],
    note: "Calculated using only the team's last 5 matches in the specified context (home/away)"
  };

  res.json(guide);
})


const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
