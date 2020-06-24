//Internal Imports
const util = require('util');

//External Imports
const jwt = require('jsonwebtoken');
const compose = require('composable-middleware');

//Custom Imports
const config = require('../configuration');
const constants = require('../utils/constants');
const db = require('../sqldb');


let isAuthenticated = () =>{
    return compose()
    .use((req, res, next) =>{
        try {
            // Enable jwt authentication
            if (!config.get("server.enableAuthentication")) return next();

            const token = req.header("x-auth-token");

            if(token){
                req.user = verifyToken(token, res);
                next()
            }else {
                // Unauthorized
                return res.status(constants.UNAUTHORIZED.code).json({
                    error: true,
                    code: constants.UNAUTHORIZED.code,
                    message: "Access denied. No token provided.",
                    data: null
                });
            }
        }catch (error) {
            console.error(util.format("Error occurred while verifying token, Error: %O", error));
            // Bad Request
            return res.status(constants.BAD_REQUEST.code).json({
                error: true,
                code: constants.BAD_REQUEST.code,
                message: "Invalid token.",
                data: null
            });
        }
    })
    // Attach user data to request
        .use(async (req, res, next) =>{
            try {
                if(req.user){
                    //To find user by id
                    await db.query('SELECT * from user_profile where id = ?',
                        req.user.id, (err, result, fields) =>{
                        if(err) throw err;

                        //If user does not exist
                        if(result.length === 0){
                            return res.status(constants.UNAUTHORIZED.code).json({
                                error: true,
                                code: constants.UNAUTHORIZED.code,
                                message: constants.UNAUTHORIZED.message,
                                data: null
                            });
                        }

                            // Attach user to request
                            req.user = result[0];
                            next();
                        })
                }else{
                    next()
                }
            }catch (error) {
                console.log("Error occurred while authentication", error);
                return next(error);
            }
        })
};


/**
 * Login token
 */
let signToken = (id) =>{
    return jwt.sign({ id: id}, config.get('server.JWT.jwtPrivateKey'), {
        expiresIn: config.get('server.JWT.jwtExpiresIn')
    });
};

/**
 * To verify token
 */
let verifyToken = (token, res) =>{
    try {
        return jwt.verify(token, config.get('server.JWT.jwtPrivateKey'));
    } catch (error) {
        throw error;
    }
};


module.exports = {
    signToken,
    isAuthenticated
};