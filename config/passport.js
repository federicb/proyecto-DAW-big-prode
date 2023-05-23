const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require('../connection')
const helpers = require('../config/helpers')



passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const {fullname} = req.body
    const newUser = {
        email,
        password,
        fullname
    };
    console.log(newUser)
    //sifra los password
    newUser.password = await helpers.encryptPassword(password);
    const [result] = await pool.query('INSERT INTO users SET ?', [newUser])
    newUser.id = result.insertId
    return done(null, newUser)

}));

// passport.use('local.signin', new localStrategy({

// }));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    done(null, rows[0])
});