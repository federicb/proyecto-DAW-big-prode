const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../config/auth');

// rastrear ultima actividad del usuario
router.use((req, res, next) => {
    if (req.session && req.session.lastActivity) {
        const now = Date.now();
        const idleTimeout = 10 * 60 * 1000; // 2 minutos en milisegundos
        //si supera 10 min de inactividad activa logout
        if (now - req.session.lastActivity > idleTimeout) {
            req.logout();
            return res.redirect('/login');
        }
    }
  
    req.session.lastActivity = Date.now();
    next();
});

router.get('/register', isNotLoggedIn, (req,res) => {
    res.render('auth/register')
});

router.post('/register', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true
}));

router.get('/login', isNotLoggedIn, (req,res) => {
    res.render('auth/login')
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/register',
        failureFlash: true
    })(req, res, next);
});


router.get('/profile',isLoggedIn, (req,res) => {
    res.render('profile')
});

router.get('/logout', isLoggedIn, (req,res) => {
    req.logOut(function(err){
        if (err) return next(err)
    });
    res.redirect('/');
});

module.exports = router;