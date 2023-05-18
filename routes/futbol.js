const {Router} = require('express');

const router = Router();


router.get('/posiciones', async (req, res) =>{
    
    try {
        const response = await fetch("https://v3.football.api-sports.io/standings?league=128&season=2023", {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "189c6369de01ac78a7e883e97676d7d1"
                // "x-rapidapi-key": "a6ecc313566f6e7c8c0a3abb265cc7df"
            }
        });
        const data = await response.json();
        // console.log(data.response);
        // console.log(data.response[0]);
        console.log(data.response[0].league.standings[1]);
        const standings = data.response[0].league.standings[1];
        res.render('positions', { standings });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error al obtener las posiciones");
    }
});

// rounds?league=128&season=2023
// fixtures?live=all
// fixtures?league=128&season=2023
// fixtures?league=128&season=2023&round=1st Phase - 9
router.get('/pronosticos', async (req, res) => {
    try {
        const response = await fetch("https://v3.football.api-sports.io/fixtures?league=128&season=2023", {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "189c6369de01ac78a7e883e97676d7d1"
                // "x-rapidapi-key": "a6ecc313566f6e7c8c0a3abb265cc7df"
            }
        });
        // const data = await response.json();
        // data.response.forEach((match) => {
        //     const homeTeamName = match.teams.home.name;
        //     const awayTeamName = match.teams.away.name;
        //     const homeGoals = match.goals.home;
        //     const awayGoals = match.goals.away;
        //     console.log(homeTeamName, " - ", homeGoals);
        //     console.log(awayTeamName, " - ", awayGoals);
        // });
        // // res.json(data.response);
        // res.render('forecasts', { matches: data.response });
        const data = await response.json();
        // console.log(data.response);
        // Filtrar los partidos por la ronda deseada
        const round = "1st Phase - 16";
        const filteredMatches = data.response.filter(match => match.league.round.includes(round));
        // console.log(filteredMatches);
        // Extraer la información necesaria de los partidos filtrados
        const matches = filteredMatches.map(match => {
            const homeTeamName = match.teams.home.name;
            const awayTeamName = match.teams.away.name;
            const homeGoals = match.goals.home;
            const awayGoals = match.goals.away;
            console.log(homeTeamName, " - ", homeGoals);
            console.log(awayTeamName, " - ", awayGoals);
          return {
            homeTeamName,
            awayTeamName,
            homeGoals,
            awayGoals
          };
        });
    
        res.render('forecasts', { matches });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error al obtener los pronósticos");
    }
});

module.exports = router;