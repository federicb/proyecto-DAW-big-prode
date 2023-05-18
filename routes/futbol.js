const {Router} = require('express');

const router = Router();


router.get('/posiciones', async (req, res) =>{
    
    try {
        const response = await fetch("https://v3.football.api-sports.io/standings?league=128&season=2023", {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "189c6369de01ac78a7e883e97676d7d1"
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
        const response = await fetch("https://v3.football.api-sports.io/fixtures?league=128&season=2023&round=1st Phase - 16", {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "189c6369de01ac78a7e883e97676d7d1"
            }
        });
        const data = await response.json();
        data.response.forEach((match) => {
            const homeTeamName = match.teams.home.name;
            const awayTeamName = match.teams.away.name;
            const homeGoals = match.goals.home;
            const awayGoals = match.goals.away;
            console.log(homeTeamName, " - ", homeGoals);
            console.log(awayTeamName, " - ", awayGoals);
        });
        res.json(data.response);
        // res.render('forecast', { matches: data.response });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error al obtener los pronósticos");
    }
});

module.exports = router;