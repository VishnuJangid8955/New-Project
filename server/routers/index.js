/**
 * Routes for
 */

module.exports = (app) =>{

    //Initialize routes for user module
    app.use('/user', require('../api/user'));

    //Initialize routes for auth module
    app.use('/auth', require('../authentication'));

};

