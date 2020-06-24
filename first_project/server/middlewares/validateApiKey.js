//Custom Imports
const constants = require('../utils/constants');
const config = require('../configuration');

module.exports = (app) => {
    app.use((req, res, next) => {

        const clientApiKey = req.header("x-api-key");

        //Error when client api key does not exist.
        if (!clientApiKey) {
            // Unauthorized
            return res.status(constants.UNAUTHORIZED.code).send({
                error: true,
                code: constants.UNAUTHORIZED.code,
                message: "Access denied. No api key provided.",
                data: null
            });
        }

        if (config.get('server.security.clientApiKey') === clientApiKey) {

            next();

        }else {
            // Unauthorized
            return res.status(constants.UNAUTHORIZED.code).send({
                error: true,
                code: constants.UNAUTHORIZED.code,
                message: "Invalid api Key.",
                data: null
            });
        }
    })
};