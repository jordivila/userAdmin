(function(module) {

    "use strict";

    var log = require('../libs/log')(module);

    var validator = require('validator');
    var RoleModel = require('../models/roles');
    var RoleValidator = require('../models/roles.validate.client');

    function create(req, i18n, cb) {

        var result = RoleValidator.validate(req, i18n, validator);

        if (result.isValid) {
            var roleReqModel = new RoleModel(req);

            getByName(roleReqModel.name, function(err, role) {
                if (err) {
                    cb(err);
                }
                if (!role) {
                    roleReqModel.save(function(err, roleCreated) {
                        if (err) {
                            cb(err);
                        } else {
                            result.isValid = true;
                            result.roleId = roleCreated.roleId;
                            result.messages.push(i18n.__("Role created"));
                            cb(null, result);
                        }
                    });
                } else {
                    result.isValid = false;
                    result.messages.push(i18n.__("Role already exists"));
                    cb(null, result);
                }
            });
        } else {
            cb(null, result);
        }
    }

    function getByName(roleName, cb) {
        RoleModel.findOne({
            name: roleName
        }, cb);
    }


    module.exports.create = create;
    module.exports.getByName = getByName;

})(module);