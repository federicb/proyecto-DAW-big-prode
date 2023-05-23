const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/register', (req,res) => {
    res.render('auth/register')
});

router.post('/register', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true
}));

router.get('/login', (req,res) => {
    res.render('auth/login')
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});


router.get('/profile', (req,res) => {
    res.send('perfil')
});

module.exports = router;