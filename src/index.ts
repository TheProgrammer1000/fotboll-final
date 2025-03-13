import express, { Request, Response } from 'express';
import 'dotenv/config';
import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs';

const app = express();
const path = './config.json';
const teamStatsPath = './teamStats.json';


let allDataFromPremierLeague;

let allTeamStats: any = [];


app.get('/team-stats', async (req: Request, res: Response) => {
  
  const league = req.query.league;
  const value = req.query.value; // Replace "value" with your specific parameter name


  // first one is 33
  
  const config: AxiosRequestConfig = {
    method: 'get',
    url: 'https://v3.football.api-sports.io/teams/statistics?league=39&season=2024&team=33',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
    params: {
      
    }
  };

  try {
    const response = await axios(config);

    // Convert the object to a JSON string before writing it to the file.
    await fs.promises.writeFile('./teamStats.json', JSON.stringify(response.data.response, null, 2), 'utf-8');
    console.log("Successfully wrote to file!");

    // Respond only once after successfully writing to file.
    res.json({ message: "File written successfully", data: response.data.response });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch leagues' });
  }
});


app.get('/get-teamStats-json', async (req: Request, res: Response) => {
  try {
    const fileContent = await fs.promises.readFile(teamStatsPath, 'utf-8');
    const configData = JSON.parse(fileContent);

    console.log("configData: ", configData);    

    res.json();
  } catch (error) {
    console.error('Error reading or parsing file:', error);
    res.status(500).json({ message: 'Failed to retrieve team IDs' });
  }
});



app.get('/team-ids', async (req: Request, res: Response) => {
  // first one is 33
  
  const config: AxiosRequestConfig = {
    method: 'get',
    url: 'https://v3.football.api-sports.io/teams?league=39&season=2024',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
    params: {
      
    }
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


app.get('/get-id-from-json', async (req: Request, res: Response) => {
  try {
    const fileContent = await fs.promises.readFile(path, 'utf-8');
    const configData = JSON.parse(fileContent);
    
    const teamIdsFinal = configData.response.map((entry: any) => {
        return {
          "id": entry.team.id,
          "teamName": entry.team.name
        }
    });

    console.log("teamIdsFinal; ", teamIdsFinal);
    
    // teamIdsFinal.map(async (team: any) => {
    //     console.log(team.id);

    //     const config: AxiosRequestConfig = {
    //       method: 'get',
    //       url: `https://v3.football.api-sports.io/teams/statistics?league=39&season=2024&team=${team.id}`,
    //       headers: {
    //         'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    //         'x-rapidapi-host': 'v3.football.api-sports.io',
    //       },
    //       params: {
            
    //       }
    //     };
        
    //     try {
    //       const response = await axios(config);
    //       const team = response.data.response;
    //       allTeamStats = team;


      
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //       res.status(500).json({ message: 'Failed to fetch leagues' });
    //     }
 
    // })
    //    //allTeamStats

    // await fs.promises.writeFile(teamStatsPath, JSON.stringify(allTeamStats, null, 2), 'utf-8');
    // console.log("Successfully wrote to file!");
    // res.json({ message: "File written successfully", data: allTeamStats });

    res.json();
  } 
  catch (error) {
    console.error('Error reading or parsing file:', error);
    res.status(500).json({ message: 'Failed to retrieve team IDs' });
  }
});



app.get('/', async (req: Request, res: Response) => {
  const fileContent = await fs.promises.readFile(teamStatsPath, 'utf-8');
  const configData = JSON.parse(fileContent);
  
  let premierLeagueStanding = configData.standings[0].table;
  
  console.log(premierLeagueStanding);
  res.json(premierLeagueStanding);

});



const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
