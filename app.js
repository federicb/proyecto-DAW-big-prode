const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');

//initializations
const app = express();

//setting
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware para manejar datos enviados desde el cliente
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(logger('dev'));
// app.use(cookieParser());

//routes
app.use(require('./routes/index.js'));
app.use(require('./routes/futbol.js'));



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
app.listen(4000, () => {
    console.log("Server on port 4000");
});