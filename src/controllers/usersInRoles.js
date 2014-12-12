(function(module) {

    "use strict";

    var log = require('../libs/log')(module);

    var validator = require('validator');
    var UsersInRoleModel = require('../models/usersInRoles');
    var rolesController = require('./roles');
    var usersController = require('./users');

    function addToRole(userId, roleName, i18n, cb) {

        var result = {
            isValid: null,
            messages: []
        };

        rolesController.getByName(roleName, function(errRole, role) {

            if (errRole) {
                cb(errRole);
            } else {

                if (!role) {
                    result.isValid = false;
                    result.messages.push(i18n.__("Role does not exists"));
                    cb(null, result);
                } else {
                    usersController.getById(userId, function(errUser, user) {
                        if (errUser) {
                            cb(errUser);
                        } else {
                            if (!user) {
                                result.isValid = false;
                                result.messages.push(i18n.__("User does not exists"));
                                cb(null, result);
                            } else {
                                var userInRoleReqModel = new UsersInRoleModel({
                                    userId: userId,
                                    roleId: role.roleId
                                });

                                userInRoleReqModel.save(function(err, userInRole) {
                                    if (err) {
                                        cb(err);
                                    } else {

                                        result.isValid = true;
                                        result.messages.push(i18n.__("User added to role"));

                                        cb(null, result);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    }



    module.exports.addToRole = addToRole;

    module.exports.setRoutes = function(app, authController) {

        /*
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
        */

    };

})(module);