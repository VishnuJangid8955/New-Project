//Internal imports
const util = require('util');

//External imports
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

//Custom imports
const db = require('../../sqldb');
const userMethod = require('../../sqldb/methods/users');


exports.setup = () =>{
    passport.use(new LocalStrategy({
        usernameField: 'mobile',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, mobile, password, done) =>{
        try {
            await db.query('SELECT * FROM user_profile where mobile = ?' , mobile, async (err, result, fields) =>{
                if(err) throw err;
                if(result.length === 0){
                    return done(null, false, 'This mobile is not registered.');
                }

                if(result[0].is_suspend === 1){
                    return done(null, false, 'This user is deactivated.')
                }

                if(result[0].is_active === 0){
                    return done(null, false, 'User is not active to use this app.')
                }

                let authenticate = await userMethod.authenticate(result[0].salt, result[0].password, password);

                if(!authenticate){
                    return done(null, false, 'This password is not correct.')
                }else {
                    return done(null, result[0]);
                }
            })
        }catch (error) {
            console.error(util.format("Error occured while login, Error: %O", error));
            done(error);
        }
    }))
};