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
        // console.log(data.response[0]);
        const standings = data.response[0].league.standings[1];
        // res.json(data.response[0].league)
        res.render('positions', { standings });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error al obtener las posiciones");
    }
});

// fixtures?league=128&season=2023&round=1st Phase - 9
router.get('/pronosticos', async (req, res) =>{
    
    try {
        const response = await fetch("https://v3.football.api-sports.io/fixtures?league=128&season=2023", {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": "189c6369de01ac78a7e883e97676d7d1"
            }
        });
        const data = await response.json();

        const filteredMatches = data.response.filter(match => match.league.round.includes('1st Phase'));
        // Obtén la fecha actual
        const currentDate = new Date().toISOString().split('T')[0];
        console.log(currentDate)

        res.render('forecasts', { currentDate, matches: filteredMatches });


    } catch (err) {
        console.log(err);
        res.status(500).send("Error al obtener las pronósticos");
    }
});

module.exports = router;