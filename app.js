const express = require('express');
const path = require('path');

//initializations
const app = express();

//setting
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//routes
app.use(require('./routes/index.js'));


//static files
app.use(express.static(path.join(__dirname, 'public')));

//server
app.listen(4000, () => {
    console.log("Server on port 4000");
});