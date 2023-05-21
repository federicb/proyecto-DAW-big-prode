const {Router} = require('express');

const router = Router();

router.get('/posiciones', async (req, res) =>{
    
    try {
        const response = await fetch("https://v3.football.api-sports.io/standings?league=128&season=2023", {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": process.env.API_KEY
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
                "x-rapidapi-key": process.env.API_KEY
            }
        });
        const data = await response.json();

        const filteredMatches = data.response.filter(match => match.league.round.includes('1st Phase'));
        // fecha actual
        const currentDate = new Date().toISOString().split('T')[0];
        // console.log(currentDate)

        // res.json(filteredMatches)
        res.render('forecasts', { currentDate, matches: filteredMatches });


    } catch (err) {
        console.log(err);
        res.status(500).send("Error al obtener las pronósticos");
    }
});

router.post('/enviar-datos', (req, res) => {
    const datos = req.body; // Obtener los datos enviados por el cliente
    console.log(datos);
    // res.send('Datos recibidos correctamente');
    res.redirect('/');
  });
  

module.exports = router;