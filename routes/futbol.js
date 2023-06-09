const {Router} = require('express');
const router = Router();
const { isLoggedIn } = require('../config/auth');
const calculate = require('../config/calcs');
const pool = require('../connection');


router.get('/positions', async (req, res) =>{
    
    try {
        const fetch = await import('node-fetch');
        const response = await fetch.default("https://v3.football.api-sports.io/standings?league=128&season=2023", {
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
router.get('/forecasts', isLoggedIn, async (req, res) =>{
    
    try {
        const fetch = await import('node-fetch');
        const response = await fetch.default("https://v3.football.api-sports.io/fixtures?league=128&season=2023", {
            method: "GET",
            headers: {
                "x-rapidapi-host": "v3.football.api-sports.io",
                "x-rapidapi-key": process.env.API_KEY
            }
        });
        const data = await response.json();

        const filteredMatches = data.response.filter(match => match.league.round.includes('1st Phase'));

        let userForecasts;
        try{
            [userForecasts] = await pool.query('SELECT * FROM forecasts WHERE id_user = ?', [req.user.id]);
        }catch (err) {
            console.log(err);
            // maneja error al obtener los pronosticos del usuario
            userForecasts = []; // valor predeterminado si hay error
          }
        // console.log(userForecasts);

        // res.json(filteredMatches)
        res.render('forecasts', {
            matches: filteredMatches,
            userForecasts,
            calculate: calculate   
         });


    } catch (err) {
        console.log(err);
        res.status(500).send("Error al obtener las pronósticos");
    }

});


router.post('/add_update', isLoggedIn, async (req, res) => {

    const datos = req.body; 
    // console.log(datos); 

    const round = datos.round;
    //busca la pocision de ' - ' +2(espacio) y luego con substring el valor del round
    const id_round = round.substring(round.indexOf('-') + 2);
    // console.log('Round:', id_round); 

    const totalPoints = datos.totalPoints;
    
    const processed_matches = {};
    
    for (const key in datos) {
        if (key.startsWith('forecasts')) {
            // match devuelve una cadena ( '[', 'string', ']')
            const id_fixture = key.match(/\[(.*?)\]/)[1];
        
            // verifica si el partido ya fue procesado
            if (processed_matches[id_fixture]) {
            continue; // omite segunda aparicion del partido
            }
        
            // marca partido como procesado
            processed_matches[id_fixture] = true;
        
            // obtiene pronostico local y visitante
            const localKey = `forecasts[${id_fixture}][local]`;
            const awayKey = `forecasts[${id_fixture}][away]`;
            const f_goal_local = datos[localKey] !== '' ? datos[localKey] : null;
            const f_goal_away = datos[awayKey] !== '' ? datos[awayKey] : null;        
            // console.log(`Id partido ${id_fixture}: Local: ${f_goal_local}, Visitante: ${f_goal_away}`);
            
            const newForecast = {
                id_fixture,
                f_goal_local,
                f_goal_away,
                id_round,
                id_user: req.user.id,
                // totalPoints
            };
            // console.log(newForecast);

            // verifica si ya existe un pronóstico para user y fixture
            const existingForecastQuery = 'SELECT * FROM forecasts WHERE id_fixture = ? AND id_user = ?';
            const existingForecastValues = [id_fixture, req.user.id];

            const [existingForecastRows] = await pool.query(existingForecastQuery, existingForecastValues);

            if (existingForecastRows.length > 0) {
                // si existe, realiza actualización
                await pool.query('UPDATE forecasts SET f_goal_local = ?, f_goal_away = ? WHERE id_fixture = ? AND id_user = ?', [f_goal_local, f_goal_away, id_fixture, req.user.id]);
                await pool.query('UPDATE users SET total_points = ? WHERE id = ?', [totalPoints, req.user.id]);
            } else {
                // si no existe, realiza inserción
                await pool.query('INSERT INTO forecasts SET ?', [newForecast]);
            }

        }
    }
  
    // res.redirect(req.get('referer'));
    res.redirect('/profile');

});  
  

module.exports = router;


