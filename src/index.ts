import express, { Request, Response } from 'express';
import 'dotenv/config';

import { config } from 'dotenv';
import cors from 'cors';
import connection from "./database";
import teamStatsRoutes from './routes/teamStats';

const app = express();
const port = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use('/team-stats', teamStatsRoutes);


app.get('/', (req, res) => {
  res.status(200).send('Hello world!');
})




app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
