(function(module) {

    "use strict";

    // Load required packages
    var passport = require('passport');
    var BasicStrategy = require('passport-http').BasicStrategy;
    var User = require('../models/users');


    module.exports.isAuthenticated = passport.authenticate('basic', {
        session: false
    });
    module.exports.basicCredentialsCheck = basicCredentialsCheck;

    passport.use(new BasicStrategy(basicCredentialsCheck));



    function basicCredentialsCheck(username, password, callback) {
        User.findOne({
            email: username
        }, function(err, user) {
            if (err) {
                return callback(err);
            }

            if (!user) {
                return callback(null, false);
            }

            user.verifyPassword(password, function(err, isMatch) {
                if (err) {
                    return callback(err);
                }

                if (!isMatch) {
                    return callback(null, false);
                }

                if (!user.isEmailConfirmed) {
                    return callback(null, false);
                }

                return callback(null, user);
            });
        });
    }



})(module);