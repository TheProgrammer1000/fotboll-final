import express, { Request, Response } from 'express';
import 'dotenv/config';
import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs';
import { config } from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';



const app = express();
const path = './teamIds.json';
const teamStatsPath = './teamStats.json';
const leagueResult = './leagueResults.json'

const leagueResultpath = './season2015Results.json'

interface TeamStats {
  name: string;
  winsHome: number;
  winsAway: number;
  lossesHome: number;
  lossesAway: number;
  totalWins: number; // New property
  draw: number;
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

app.get('/get-teamStats-json', async (req: Request, res: Response) => {
  try {
    const fileContent = await fs.promises.readFile(teamStatsPath, 'utf-8');
    const configData = JSON.parse(fileContent);

    const arrayStatsOfTeam = configData;
 

    res.json(arrayStatsOfTeam);
  } catch (error) {
    console.error('Error reading or parsing file:', error);
    res.status(500).json({ message: 'Failed to retrieve team IDs' });
  }
});



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

    await fs.promises.writeFile(path, JSON.stringify(response.data.response, null, 2), 'utf-8');
    console.log("Successfully wrote to file!");

    res.json({ message: "File written successfully", data: response.data.response });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch leagues' });
  }
});



// Helper function to delay execution for a given number of milliseconds.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/* 
  This reading from the config.json file that should already be all the team and their ids!!!!!
*/
app.get('/fetch-teamStats', async (req: Request, res: Response) => {
  try {
    const fileContent = await fs.promises.readFile(path, 'utf-8');
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


app.get('/fetch-result', async (req: Request, res: Response) => {
  // first one is 33
  
  const config: AxiosRequestConfig = {
    method: 'get',
    url: 'https://v3.football.api-sports.io/fixtures?league=39&season=2015',
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

    await fs.promises.writeFile(leagueResultpath, JSON.stringify(response.data.response, null, 2), 'utf-8');
    console.log("Successfully wrote to file!");

    res.json({ message: "File written successfully", data: response.data.response });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch leagues' });
  }
});



app.get('/getResultByTeam/:id', async (req: Request, res: Response) => {

  let IsEqualToTeamid = false;
  
  const teamId = parseInt(req.params.id, 10); // Extract 'id' from route parameters and convert to number
 
  //console.log('req.params.id: ', req.params.id);

  const fileTeamId = await fs.promises.readFile(path, 'utf-8');
  const parseFileTeamId = JSON.parse(fileTeamId);

  
  const teamIdsFinal = parseFileTeamId.map((entry: any) => {
      return {
        "id": entry.team.id,
        "teamName": entry.team.name
      }
  });



  for(let i = 0; i < teamIdsFinal.length; i++) {
    if(teamIdsFinal[i].id == teamId) {
      IsEqualToTeamid = true;
      break;
    }
  }

  if(IsEqualToTeamid == true) {

    const fileContent = await fs.promises.readFile(leagueResult, 'utf-8');
    const configData = JSON.parse(fileContent);
    
    // Assuming configData is an array of match objects
    const matchesArray = [...configData];
    let sortedMatchesTeam: any[] = []; // Explicitly declare as an array
  
    // Loop through matches and push those matching the teamId
    for (let i = 0; i < matchesArray.length; i++) {    
      if ((matchesArray[i].teams.home.id === teamId || matchesArray[i].teams.away.id === teamId) && matchesArray[i].teams.home.winner != null || matchesArray[i].teams.away.winner) {
        sortedMatchesTeam.push(matchesArray[i]);
      }
    }

    res.json(sortedMatchesTeam);
  }
  else {
    res.status(500).json({ message: 'Failed to fetch team by teamID'});
  }
});
app.get('/getResultByTeam/:firstId/:secoundId', async (req: Request, res: Response) => {
  const firstId = parseInt(req.params.firstId, 10);
  const secoundId = parseInt(req.params.secoundId, 10);

  try {
    // Read and parse the team IDs file
    const fileTeamId = await fs.promises.readFile(path, 'utf-8');
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

    const seasonsNameJson = [
      './season2024Results.json',
      './season2023Results.json',
      './season2022Results.json',
      './season2021Results.json',
      './season2020Results.json',
      './season2019Results.json',
      './season2018Results.json',
      './season2017Results.json',
      './season2016Results.json',
      './season2015Results.json',
    ];

    let sortedMatchesTeam: any[] = [];

    for (const seasonFile of seasonsNameJson) {
      try {
        const fileContent = await fs.promises.readFile(seasonFile, 'utf-8');
        console.log(fileContent);
        const matchesArray = JSON.parse(fileContent);
        console.log(matchesArray);

        // Filter matches between team1 and team2 with a valid result (status elapsed is not null)
        const filteredMatches = matchesArray.filter(
          (match: any) =>
            (match.teams.home.id === team1.id &&
              match.teams.away.id === team2.id &&
              match.fixture.status.elapsed !== null) ||
            (match.teams.home.id === team2.id &&
              match.teams.away.id === team1.id &&
              match.fixture.status.elapsed !== null)
        );

        sortedMatchesTeam.push(...filteredMatches);
      } catch (err) {
        if (err instanceof Error) {
          console.error(`Error reading or parsing ${seasonFile}:`, err.message);
        } else {
          console.error(`Unknown error reading or parsing ${seasonFile}:`, err);
        }
        // Continue to next season file if one fails
        continue;
      }
    }

    console.log('sortedMatchesTeam: ', sortedMatchesTeam);


    const sinceSeason = 2015;

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




app.get('/', async (req: Request, res: Response) => {
  // const fileContent = await fs.promises.readFile(teamStatsPath, 'utf-8');
  // const configData = JSON.parse(fileContent);
  
  // let premierLeagueStanding = configData.standings[0].table;
  
  // console.log(premierLeagueStanding);
  res.json();

});



const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
