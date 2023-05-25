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
    const datos = req.body; 
    // console.log(datos); 
    // console.log(datos.round);
    const round = datos.round;
    //busca la pocision de ' - ' +2(espacio) y luego con substring el valor del round
    const roundNumber = round.substring(round.indexOf('-') + 2);

    console.log('Round:', roundNumber); 
    
    const processed_matches = {};
    
    for (const key in datos) {
      if (key.startsWith('forecasts')) {
        const fixtureId = key.match(/\[(.*?)\]/)[1];
    
        // verifica si el partido ya fue procesado
        if (processed_matches[fixtureId]) {
          continue; // omite segunda aparicion del partido
        }
    
        // marca partido como procesado
        processed_matches[fixtureId] = true;
    
        // obtiene pronostico local y visitante
        const localKey = `forecasts[${fixtureId}][local]`;
        const awayKey = `forecasts[${fixtureId}][away]`;
        const local = datos[localKey];
        const away = datos[awayKey];
    
        console.log(`Pronostico partido ${fixtureId}: Local: ${local}, Visitante: ${away}`);
      }
    }
  
    res.send('Datos recibidos correctamente');
    // res.redirect('/');
  });
  
  
  
  
  
  
  

module.exports = router;


