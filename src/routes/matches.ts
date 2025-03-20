import express from 'express';
import connection from "../database";

const router = express.Router();

// Original route moved here
router.get('/upcoming-matches', async (req, res) => {
  connection.query(`

SELECT z.*, p.HomeTeamID, p.HomeTeamName, p.AwayTeamID, p.AwayTeamName, p.FixtureDate FROM (
        SELECT t.FixtureID,
                   MAX(CASE WHEN t.odds1 = max_odds.max_odds1 THEN t.Bookmaker ELSE NULL END) AS bookmaker_odds1,
                   MAX(CASE WHEN t.oddsx = max_odds.max_oddsx THEN t.Bookmaker ELSE NULL END) AS bookmaker_oddsx,
                   MAX(CASE WHEN t.odds2 = max_odds.max_odds2 THEN t.Bookmaker ELSE NULL END) AS bookmaker_odds2,
                   max_odds.max_odds1 AS max_odds1,
                   max_odds.max_oddsx AS max_oddsx,
                   max_odds.max_odds2 AS max_odds2
        FROM mptmatchesOdds t
        INNER JOIN (
                SELECT FixtureID,
                           MAX(odds1) AS max_odds1,
                           MAX(oddsx) AS max_oddsx,
                           MAX(odds2) AS max_odds2
                FROM mptmatchesOdds t
                GROUP BY FixtureID
        ) AS max_odds
        ON t.FixtureID = max_odds.FixtureID
        GROUP BY t.FixtureID
) AS z LEFT JOIN mptMatches p
        ON      z.FixtureID     = p.FixtureID
        AND     p.MatchPlayed   = 0
ORDER BY p.FixtureDate, z.FixtureID

        `, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return;
    }

    res.json(results);

  });
});

router.get('/recently-played/total/:teamID', async (req, res) => {

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


router.get('/recently-played/home/:teamID', async (req, res) => {
  console.log(req.params.teamID);

  connection.query(`
        SELECT HomeTeamID, HomeTeamName, GoalsHome, AwayTeamID, AwayTeamName, GoalsAway, FixtureDate  
        FROM mptMatches
        WHERE (HomeTeamID = ${req.params.teamID})
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


router.get('/recently-played/away/:teamID', async (req, res) => {
  connection.query(`
        SELECT HomeTeamID, HomeTeamName, GoalsHome, AwayTeamID, AwayTeamName, GoalsAway, FixtureDate  
        FROM mptMatches
        WHERE (AwayTeamID = ${req.params.teamID})
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


router.get('/upcoming-match/odds/:fixtureID', async (req, res) => {
  connection.query(`
    SELECT a.FixtureID, a.HomeTeamID, a.HomeTeamName, a.AwayTeamID, a.AwayTeamName, a.FixtureDate, b.Bookmaker, b.OddsUpdateDate, b.Odds1 AS bookmaker_odds1, b.OddsX AS bookmaker_oddsx, b.Odds2 AS bookmaker_odds2
    FROM mptMatches a, mptmatchesOdds b
      WHERE a.FixtureID = b.FixtureID
      AND   b.FixtureID = ${req.params.fixtureID}
      AND   a.MatchPlayed = 0
    ORDER BY b.Bookmaker 

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