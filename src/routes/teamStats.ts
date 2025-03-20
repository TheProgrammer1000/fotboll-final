import express from 'express';
import connection from "../database";

const router = express.Router();

// Original route moved here
router.get('/', async (req, res) => {
    connection.query(`
            SELECT a.TeamsID, a.TeamsName, b.PlayedTotal, b.PlayedWinsTotal, b.PlayedDrawsTotal, b.PlayedLosesTotal, b.PlayedGoalsTotal, b.PlayedGoalsAgainstTotal, b.GoalsDiff, b.Points, a.TeamsLogo
            FROM mptTeams a, mptMatchesDetils b
            WHERE a.TeamsID = b.TeamsID
            ORDER BY b.Points DESC, b.GoalsDiff DESC, b.PlayedGoalsTotal DESC
        `, (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return;
        }

        res.json(results);
        
      });
});

router.get('/home', async (req, res) => {
  connection.query(`
        SELECT a.TeamsID, a.TeamsName, b.PlayedHome AS PlayedTotal, b.PlayedWinsHome AS PlayedWinsTotal, b.PlayedDrawsHome AS PlayedDrawsTotal, b.PlayedLosesHome AS PlayedLosesTotal, b.PlayedGoalsTotalHome AS PlayedGoalsTotal, b.PlayedGoalsAgainstTotalHome AS PlayedGoalsAgainstTotal, b.GoalsDiffHome AS GoalsDiff, b.PointsHome AS Points, a.TeamsLogo  
        FROM mptTeams a, mptMatchesDetils b
        WHERE a.TeamsID = b.TeamsID
        ORDER BY b.PointsHome DESC, b.GoalsDiffHome DESC, b.PlayedGoalsTotalHome DESC
      `, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return;
      }

      res.json(results);
      
    });
});

router.get('/away', async (req, res) => {
  connection.query(`
          SELECT a.TeamsID, a.TeamsName, b.PlayedAway AS PlayedTotal, b.PlayedWinsAway AS PlayedWinsTotal, b.PlayedDrawsAway AS PlayedDrawsTotal, b.PlayedLosesAway AS PlayedLosesTotal, b.PlayedGoalsTotalAway AS PlayedGoalsTotal, b.PlayedGoalsAgainstTotalAway AS PlayedGoalsAgainstTotal, b.GoalsDiffAway AS GoalsDiff, b.PointsAway AS Points, a.TeamsLogo
          FROM mptTeams a, mptMatchesDetils b
          WHERE a.TeamsID = b.TeamsID
          ORDER BY b.PointsAway DESC, b.GoalsDiffAway DESC, b.PlayedGoalsTotalAway DESC
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