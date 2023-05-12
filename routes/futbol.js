const {Router} = require('express');

const router = Router();

router.get('/posiciones', async (req, res) =>{
  
    fetch("https://v3.football.api-sports.io/standings?league=128&season=2023", {
        method: "GET",
        headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": "189c6369de01ac78a7e883e97676d7d1"
        }
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.response);
    })
    .catch((err) => {
        console.log(err);
    });


});

module.exports = router;