(function(module) {

    "use strict";

    module.exports.create = create;
    module.exports.getByName = getByName;



    var log = require('../libs/log')(module);
    var validator = require('validator');
    var RoleModel = require('../models/usersRoles');
    var RoleValidator = require('../models/usersRoles.validate.client');
    var DataResultModel = require('../models/dataResult');
    var ErrorHandledModel = require('../models/errorHandled');

    function create(req, i18n, cb) {

        RoleValidator.validate(req, i18n, validator, function(err, resultValidation) {
            if (err) return cb(err);
            if (!resultValidation.isValid) return cb(null, resultValidation);

            var roleReqModel = new RoleModel(req);

            getByName(roleReqModel.name, function(err, role) {
                if (err) return cb(err);
                if (role) return cb(new ErrorHandledModel(i18n.__("AccountResources.RoleAlreadyExists")));


                roleReqModel.save(function(err, roleCreated) {
                    if (err) return cb(err);

                    return cb(null, new DataResultModel(true, i18n.__("AccountResources.RoleCreated"), {
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

})(module);