(function(module) {

    "use strict";

    var log = require('../libs/log')(module);
    var validator = require('validator');
    var RoleModel = require('../models/roles');
    var RoleValidator = require('../models/roles.validate.client');
    var DataResultModel = require('../models/dataResult');

    function create(req, i18n, cb) {

        RoleValidator.validate(req, i18n, validator, function(err, resultValidation) {
            if (err) return cb(err);
            if (!resultValidation.isValid) return cb(null, resultValidation);

            var roleReqModel = new RoleModel(req);

            getByName(roleReqModel.name, function(err, role) {
                if (err) return cb(err);
                if (role) return cb(new ErrorHandledModel(i18n.__("Role already exists")));


                roleReqModel.save(function(err, roleCreated) {
                    if (err) return cb(err);

                    return cb(null, new DataResultModel(true, i18n.__("Role created"), {
                        roleId: roleCreated.roleId
                    }));
                });

            });

        });
    }

    function getByName(roleName, cb) {
        RoleModel.findOne({
            name: roleName
        }, cb);
    }


    module.exports.create = create;
    module.exports.getByName = getByName;

})(module);