(function(module) {

    "use strict";

    module.exports.addToRole = addToRole;

    var log = require('../libs/log')(module);
    var validator = require('validator');
    var ErrorHandledModel = require('../models/errorHandled');
    var UsersInRoleModel = require('../models/usersInRoles');
    var DataResultModel = require('../models/dataResult');
    var rolesController = require('./usersRoles');
    var usersController = require('./users');

    function addToRole(userId, roleName, i18n, cb) {

        rolesController.getByName(roleName, function(errRole, role) {

            if (errRole) return cb(errRole);

            if (!role) {
                return cb(new ErrorHandledModel(i18n.__("AccountResources.RoleNotExists"), {
                    roleNotFound: true
                }));
            }

            usersController.getById(userId, function(errUser, user) {

                if (errUser) return cb(errUser);

                if (!user) {
                    return cb(new ErrorHandledModel(i18n.__("AccountResources.UserNotExists"), {
                        userNotFound: true
                    }));
                }

                var userInRoleReqModel = new UsersInRoleModel({
                    userId: userId,
                    roleId: role.roleId
                });

                userInRoleReqModel.save(function(errSaving, userInRole) {
                    if (errSaving) return cb(errSaving);

                    return cb(null, new DataResultModel(true, i18n.__("AccountResources.UserAddedToRole")));
                });
            });
        });
    }

})(module);