import express from 'express';
import connection from "../database";

const router = express.Router();

// Original route moved here
router.get('/upcoming-matches', async (req, res) => {
    connection.query(`
           SELECT a.FixtureID, a.HomeTeamID, a.HomeTeamName, a.AwayTeamID, a.AwayTeamName, a.FixtureDate, b.Bookmaker, b.OddsUpdateDate, b.Odds1, b.OddsX, b.Odds2  
                FROM mptMatches a, mptmatchesOdds b
                WHERE a.FixtureID = b.FixtureID
                AND   b.Bookmaker = 'Unibet'
                AND   a.MatchPlayed = 0
                ORDER BY a.FixtureDate
             

        `, (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return;
        }

        res.json(results);
        
      });
});

router.get('/recently-played/:teamID', async (req, res) => {
  
  console.log(req.params.teamID);
  
  connection.query(`
        SELECT HomeTeamID, HomeTeamName, GoalsHome, AwayTeamID, AwayTeamName, GoalsAway, FixtureDate  
        FROM mptMatches
        WHERE (HomeTeamID = ${req.params.teamID} OR AwayTeamID = ${req.params.teamID})
        AND   MatchPlayed = 1
        ORDER BY FixtureDate DESC LIMIT 5
           

      `, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return;
      }

      res.json(results);
      
    });
});


// Add more team-related routes below
// router.get('/another-route', ...)

export default router;