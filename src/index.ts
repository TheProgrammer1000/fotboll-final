import express, { Request, Response } from 'express';
import 'dotenv/config';
import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs';

const app = express();
const path = './config.json';


let allDataFromPremierLeague;


async function getTeamWins(teamName: string): Promise<number> {
  const configFilePath: string = "./config.json"
  let teamwin = 0;

  try {
    const fileContent = await fs.promises.readFile(configFilePath, 'utf-8');
    const configData = JSON.parse(fileContent);

    for (let i = 0; i < configData['response'].length; i++) {
      const team = configData['response'][i]['teams'];

      if (team['home']['name'].toLowerCase() == teamName.toLocaleLowerCase() || team['away']['name'].toLowerCase() == teamName.toLocaleLowerCase()) {
        if (team['home']['winner'] == true || team['away']['winner']) {
          teamwin++;
        }
      }
    }

    return teamwin; // Add this line to return the value of teamwin
  } catch (err) {
    console.error(err);
    return 0; // Add this line to handle the error case and return a default value
  }
}



app.get('/fetch-leagues', async (req: Request, res: Response) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: 'https://v3.football.api-sports.io/teams/statistics',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'v3.football.api-sports.io',
    },
    params: {
      season: 2019,
      team: "33",
      league: '39'
    }
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch leagues' });
  }



});

app.get('/', async (req: Request, res: Response) => {
    res.send('Tjaba');

});



const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
