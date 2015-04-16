(function (module) {
    
    "use strict";
    
    // Load required packages
    var passport = require('passport');
    var BasicStrategy = require('passport-http').BasicStrategy;
    var User = require('../models/users');
    
    
    module.exports.basicCredentialsCheck = basicCredentialsCheck;
    module.exports.isAuthenticated = function (req, res, next) {
        
        //  when using basic auth passports sends header WWW-Authenticate
        //  which forces browser to show a dialog box asking for user credentials 
        //  
        
        //passport.authenticate('basic', {
        //    session: false
        //})(req, res, next);
        
        // I use a custom callback on passport baic auth
        // avoiding this header to be sent
        
        passport.authenticate(
            'basic', {
                session: false
            },
            function (err, user, info) {
                
                if (err) {
                    return next(err);
                }
                if (!user) {
                    res.status(401);
                }
                
                req.user = user;
                
                next();

            })(req, res, next);



    };
    
    
    
    passport.use(new BasicStrategy({
            passReqToCallback: true
        }, basicCredentialsCheck));
    
    
    
    function basicCredentialsCheck(req, username, password, callback) {
        
        var i18n = req.i18n;
        
        User.findOne({
            email: username
        }, function (err, user) {
            if (err) {
                return callback(err);
            }
            
            if (!user) {
                return callback(null, false, {
                    message: i18n.__("AccountResources.InvalidCredentials")
                });
            }
            
            user.verifyPassword(password, function (err, isMatch) {
                if (err) {
                    return callback(err);
                }
                
                if (!isMatch) {
                    return callback(null, false, {
                        message: i18n.__("AccountResources.InvalidCredentials")
                    });
                }
                
                if (!user.isEmailConfirmed) {
                    return callback(null, false, {
                        message: i18n.__("AccountResources.PleaseConfirmAccount")
                    });
                }
                
                return callback(null, user);
            });
        });
    }



})(module);