const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const {database} = require('./keys');
const passport = require('passport');
const flash = require('connect-flash');

const pool = require('./connection')
//initializations
const app = express();

const SQL_session = require("express-mysql-session")(session)
require('./config/passport');

//setting
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware 
app.use(session({
    secret: 'bigbig',
    resave: false,
    saveUninitialized: false,
    store: new SQL_session({},pool),
    cookie: {
        maxAge: 600000, // 10 minutos en milisegundos
      }
}));

app.use(flash());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


// global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/futbol'));
app.use(require('./routes/authentication'));



//static files
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
 // error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//server
app.listen(3000, () => {
    console.log("Server on port 3000");
});