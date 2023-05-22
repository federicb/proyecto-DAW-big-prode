const {Router} = require('express');

const router = Router();

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', (req, res) =>{

});

module.exports = router;