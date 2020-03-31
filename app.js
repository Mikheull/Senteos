const express = require("express");
const app = express();
const server = require('http').createServer(app);
const session = require('express-session');
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');

// Config
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}))

// Router
const router = require('./routes/routes');
app.use('/', router);


server.listen(process.env.APP_PORT, () => {
    console.log(`Listening to requests on http://localhost:${process.env.APP_PORT}`);
});
