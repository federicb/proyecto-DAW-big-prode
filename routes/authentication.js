const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/register', (req,res) => {
    res.render('auth/register')
})

router.post('/register', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true
}))


router.get('/profile', (req,res) => {
    res.send('perfil')
});

module.exports = router;