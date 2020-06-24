//Internal imports
const util = require('util');

//External imports
const express = require('express');
const passport = require('passport');


//Custom imports
const constants = require('../../utils/constants');
const auth = require('../auth.service');

//Initialize router
const router = express.Router();

router.post('/', (req, res, next) =>{
    // Initialize passport local authentication
    passport.authenticate('local', async (err, user, info) =>{
        let error = err || info;

        if(error){
            // Unauthorized
            return res.status(constants.UNAUTHORIZED.code).json({
                error: true,
                code: constants.UNAUTHORIZED.code,
                message: error.message || error,
                data: null
            });
        }

        if (info) {
            // Unauthorized
            return res.status(constants.UNAUTHORIZED.code).json({
                error: true,
                code: constants.UNAUTHORIZED.code,
                message: info,
                data: null
            });
        }

        if (!user) {
            return res.status(404).json({
                error: false,
                code: constants.NOT_FOUND.code,
                message: 'Something went wrong, please try again.',
                data: null
            });
        }

        //signIn Token
        let token = auth.signToken(user.id, 1);

        res.status(constants.OK.code).json({
            error: false,
            code: constants.OK.code,
            message: constants.OK.message,
            data: {
                token: token
            }
        })
    })(req, res, next);
});


module.exports = router;