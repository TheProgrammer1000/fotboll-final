import express, { Request, Response } from 'express';
import 'dotenv/config';
import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs';
import { config } from 'dotenv';
import cors from 'cors';



const app = express();
const path = './teamIds.json';
const teamStatsPath = './teamStats.json';

let allTeamStats: any = [];
app.use(cors());

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
