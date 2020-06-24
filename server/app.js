/**
 * Main application file
 */

//Internal imports
const fs = require('fs');
const http = require('http');
const https = require('https');


//External imports
const express = require('express');
let server;


//Custom imports
const config = require('./configuration');


/**
 * create connection
 */
require('./sqldb');


const app = express();

//create server
server = http.createServer(app);

//middleware
require('./middlewares') (app, express, __dirname);

//routes
require('./routers') (app);

app.set('port', config.get('server.http.port'));


server.listen(app.get('port'));

module.exports = app;