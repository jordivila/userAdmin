(function(module) {

    "use strict";

    module.exports.create = create;
    module.exports.getByGuid = getByGuid;
    module.exports.deleteByGuid = deleteByGuid;


    var uuid = require('node-uuid');
    var TokenTempModel = require('../models/tokenTemp');

    function create(destroyDate, jsonObject, i18n, cb) {

        var tokenTempModel = new TokenTempModel({
            guid: uuid.v1(),
            destroyDate: destroyDate,
            jsonObject: jsonObject
        });

        tokenTempModel.save(function(err, token) {
            if (err) return cb(err);

            return cb(null, token);
        });
    }

    function getByGuid(guid, cb) {
        TokenTempModel.findOne({
            guid: guid
        }, cb);
    }

    function deleteByGuid(guid, cb) {
        TokenTempModel.where().findOneAndRemove({
            guid: guid
        }, cb);
    }



})(module);