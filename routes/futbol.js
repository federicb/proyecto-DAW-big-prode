const {Router} = require('express');
const router = Router();
const { isLoggedIn } = require('../config/auth');
const calculate = require('../config/calcs');
const pool = require('../connection');
const { v4: uuidv4 } = require('uuid');

router.get('/positions', async (req, res) =>{
    
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
router.get('/forecasts', isLoggedIn, async (req, res) =>{
    
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
            // console.log(`Pronostico partido ${id_fixture}: Local: ${f_goal_local}, Visitante: ${f_goal_away}`);
            
            const newForecast = {
                id_fixture,
                f_goal_local,
                f_goal_away,
                id_round,
                id_user: req.user.id,
                totalPoints
            };
            // console.log(newForecast);

            // verifica si ya existe un pronóstico para user y fixture
            const existingForecastQuery = 'SELECT * FROM forecasts WHERE id_fixture = ? AND id_user = ?';
            const existingForecastValues = [id_fixture, req.user.id];

            const [existingForecastRows, _] = await pool.query(existingForecastQuery, existingForecastValues);

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
  
    res.redirect(req.get('referer'));

});  

router.get('/groups', isLoggedIn, async (req, res) => {
  
    try {

        const [groups_members2] = await pool.query('SELECT users.fullname, users.total_points, `groups`.group_name, `groups`.invitation, users_groups.id_user, users_groups.id_group FROM users INNER JOIN users_groups ON users_groups.id_user = users.id INNER JOIN `groups` ON `groups`.id = users_groups.id_group ORDER BY users.total_points DESC');
        // console.log(groups_members2)

        const [totalMembers2] = await pool.query('SELECT `groups`.id, `groups`.group_name, `groups`.invitation, COUNT(*) AS total_integrantes FROM users INNER JOIN users_groups ON users_groups.id_user = users.id INNER JOIN `groups` ON `groups`.id = users_groups.id_group GROUP BY `groups`.group_name ORDER BY total_integrantes DESC')
        // console.log(totalMembers2)

        const [groups_user2] = await pool.query('SELECT users.fullname, users.total_points, `groups`.group_name, `groups`.invitation, users_groups.id_user, users_groups.id_group FROM users INNER JOIN users_groups ON users_groups.id_user = users.id INNER JOIN `groups` ON `groups`.id = users_groups.id_group WHERE users_groups.id_user = ? ORDER BY users.total_points DESC', [req.user.id]);
        // console.log(groups_user2)      

        const joinLink = req.session.joinLink;
        // delete req.session.joinLink; // elimina enlace después de obtenerlo


    // console.log(groups_members);
    // res.json({ 
    //      groups_user2,
    //     totalMembers2,
    //     groups_members2
    // });

    res.render('groups', {
        totalMembers2,
        groups_members2,
        groups_user2,
        joinLink
    });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los datos');
    }
});
  

router.get('/new_group', isLoggedIn, (req, res) => {
    res.render('auth/new_group')
});

router.post('/create_group', isLoggedIn, async (req, res) => {
    const  group_name  = req.body.group_name; 
  
    // genera un UUID para el grupo
    const groupId = uuidv4();

    // genera el enlace para unirse al grupo
    const joinLink = `https://localhost:4000/join/${groupId}`;
    req.session.joinLink = joinLink;
  
    const newGroup = {
        group_name, 
        id: groupId,
        user_creator: req.user.id,
        invitation: joinLink
    }
    await pool.query('INSERT INTO `groups` SET ?', [newGroup]);

    const userId = req.user.id;

    // creador miembro
    const membership = {
        id_user: userId,
        id_group: groupId
    };
    await pool.query('INSERT INTO users_groups SET ?', [membership]);

    req.flash('success', 'Link saved successfully') 
  
    // res.json({ joinLink });
    res.redirect('/groups');
  });

router.get('/leave_group/:id', isLoggedIn, async (req, res) => {
    const id_group  = req.params.id;
    const id_user = req.user.id;

    await pool.query('DELETE FROM users_groups WHERE id_user = ? AND id_group = ?', [id_user, id_group])

    req.flash('success', 'Link deleted successfully')
    res.redirect('/groups')
});
  
  router.get('/join/:groupId', isLoggedIn, async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.user.id;
  
    try {
        // comprueba si el usuario es miembro del grupo
        const [existingMembership] = await pool.query('SELECT * FROM users_groups WHERE id_user = ? AND id_group = ?', [userId, groupId]);
    
        if (existingMembership.length > 0) {
            req.flash('info', 'Ya eres miembro de este grupo');
            res.redirect('/groups');
        } else {
            const membership = {
            id_user: userId,
            id_group: groupId
            };
            await pool.query('INSERT INTO users_groups SET ?', [membership]);
    
            req.flash('success', 'Te has unido al grupo exitosamente');
            res.redirect('/groups');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al unirse al grupo');
    }
});

router.get('/get_invitation', async (req, res) => {
    const groupId = req.query.id_group;
  
    try {
        const [result] = await pool.query('SELECT invitation FROM `groups` WHERE id = ?', [groupId]);
        const invitation = result[0].invitation;
        // console.log(invitation);
    
        // envio respuesta
        res.json({ invitation });
      } catch (error) {
        console.log('Error al obtener la invitación:', error);
        res.status(500).json({ error: 'Error al obtener la invitación' });
      }
  });
  

module.exports = router;


