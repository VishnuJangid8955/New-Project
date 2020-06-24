//Internal Imports
const path = require('path');

//External Imports
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');

//Custom Imports
const validateApiKey = require('./validateApiKey');
const config = require('../configuration');


module.exports = (app, express, root) => {

    //Enable api key validation
    if(config.get('server.security.enableApiKey'))
        require("./validateApiKey")(app);

    //Enable compression
    if(config.get('server.enableCompression'))
        app.use(compression());

    //Enable static Directory Path
    if(config.get('server.enableStatic'))
        app.use(express.static(path.join(root, config.get('server.static.directory'))));

    //Enable CORS support
    if(config.get('server.security.enableCORS'))
        require('./CORS')(app);


    // Enable request body parsing
    app.use(bodyParser.urlencoded({extended: false, limit: config.get('server.bodyParser.limit')}));

    // Enable request body parsing in JSON format
    app.use(bodyParser.json({limit: config.get('server.bodyParser.limit')}));

    // Enable cookie parser
    app.use(cookieParser(config.get('server.session.cookieSecret')));



};