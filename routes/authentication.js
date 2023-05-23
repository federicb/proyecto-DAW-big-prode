const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../config/auth')

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
        failureRedirect: '/login',
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