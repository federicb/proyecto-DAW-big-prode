const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require('../connection');
const helpers = require('../config/helpers');


// register strategy
passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    console.log(req.body);
    const {fullname} = req.body
    const newUser = {
        email,
        password,
        fullname
    };
    
    //sifra los password
    newUser.password = await helpers.encryptPassword(password);
    const [result] = await pool.query('INSERT INTO users SET ?', [newUser])
    newUser.id = result.insertId
    return done(null, newUser)

}));

// login strategy
passport.use('local.signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    console.log(req.body);
    // const {fullname} = req.body
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword){
            done(null, user, req.flash('success', 'Bienvenido'));
        }else{
            done(null, false, req.flash('success', 'Cuenta o password incorrecto.'))
        }
    }
     else{
        return done(null, false, req.flash('message', 'La cuenta no existe.'))
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id])
    done(null, rows[0])
});