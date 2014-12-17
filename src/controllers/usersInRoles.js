(function(module) {

    "use strict";

    module.exports.addToRole = addToRole;
    module.exports.setRoutes = setRoutes;


    var log = require('../libs/log')(module);
    var validator = require('validator');
    var ErrorHandledModel = require('../models/errorHandled');
    var UsersInRoleModel = require('../models/usersInRoles');
    var DataResultModel = require('../models/dataResult');
    var rolesController = require('./roles');
    var usersController = require('./users');

    function addToRole(userId, roleName, i18n, cb) {

        rolesController.getByName(roleName, function(errRole, role) {

            if (errRole) return cb(errRole);

            if (!role) {
                return cb(new ErrorHandledModel(i18n.__("Role does not exists"), {
                    roleNotFound: true
                }));
            }

            usersController.getById(userId, function(errUser, user) {

                if (errUser) return cb(errUser);

                if (!user) {
                    return cb(new ErrorHandledModel(i18n.__("User does not exists"), {
                        userNotFound: true
                    }));
                }

                var userInRoleReqModel = new UsersInRoleModel({
                    userId: userId,
                    roleId: role.roleId
                });

                userInRoleReqModel.save(function(errSaving, userInRole) {
                    if (errSaving) return cb(errSaving);

                    return cb(null, new DataResultModel(true, i18n.__("User added to role")));
                });
            });
        });
    }

    function setRoutes(app, authController) {

    }

})(module);