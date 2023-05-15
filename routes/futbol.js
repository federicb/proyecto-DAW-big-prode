const {Router} = require('express');

const router = Router();

router.get('/posiciones', async (req, res) =>{
    // https://v3.football.api-sports.io/standings?league=128&season=2023
    // https://v3.football.api-sports.io/fixtures?live=all
    fetch("https://v3.football.api-sports.io/standings?league=128&season=2023", {
        method: "GET",
        headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": "189c6369de01ac78a7e883e97676d7d1"
        }
    })
    .then((response) => response.json())
    .then((data) => {
        // console.log(data.response);
        // console.log(data.response[0]);
        console.log(data.response[0].league.standings[1]);
        const standings = data.response[0].league.standings[1];

        standings.forEach(team => {
        const teamName = team.team.name;
        console.log(teamName);
        });

        res.send(data.response[0].league.standings[1]);
    })
    .catch((err) => {
        console.log(err);
    });


});

module.exports = router;