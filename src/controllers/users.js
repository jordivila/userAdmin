(function(module) {

    "use strict";

    var log = require('../libs/log')(module);

    var validator = require('validator');
    var UserModel = require('../models/users');
    var UserValidator = require('../models/users.validate.client');
    var usersInRolesController = require('./usersInRoles');

    function create(req, i18n, cb) {

        var result = UserValidator.validate(req, i18n, validator);

        if (result.isValid) {
            var userReqModel = new UserModel(req);

            UserModel.findOne({
                email: userReqModel.email
            }, function(err, user) {
                if (err) cb(err);
                if (!user) {
                    userReqModel.save(function(err, userCreated) {
                        if (err) {
                            cb(err);
                        } else {

                            usersInRolesController.addToRole(
                                userCreated.userId,
                                "Guest",
                                i18n,
                                function(err, userInRoleAdded) {
                                    if (err) {
                                        cb(err);
                                    } else {

                                        if (!userInRoleAdded.isValid) {
                                            result.isValid = userInRoleAdded.isValid;
                                            result.messages = userInRoleAdded.messages;
                                        } else {
                                            result.isValid = true;
                                            result.userId = userCreated.userId;
                                            result.messages.push(i18n.__("User created"));
                                        }
                                        cb(null, result);
                                    }
                                });
                        }
                    });
                } else {
                    result.isValid = false;
                    result.messages.push(i18n.__("User already exists"));
                    cb(null, result);
                }
            });
        } else {
            cb(null, result);
        }
    }

    function getById(userId, cb) {
        UserModel.findById(userId, cb);
    }


    module.exports.create = create;
    module.exports.getById = getById;

    module.exports.setRoutes = function(app, authController) {

        app.get('/api/user', [
            authController.isAuthenticated,
            function(req, res, next) {
                var user = req.user;
                res.json(user); // passport sets user object when authenticated
            }
        ]);

        app.post('/api/user', function(req, res, next) {
            var result = create(req.body, req.i18n, function(err, user) {
                if (err) {
                    next(err);
                } else {
                    res.json(user);
                }
            });
        });
    };

})(module);