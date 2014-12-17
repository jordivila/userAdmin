(function(module) {

    "use strict";

    module.exports.validatePasswordStrength = validatePasswordStrength;
    module.exports.validate = validate;


    var validator = require('validator');
    var ErrorHandled = require('../models/errorHandled');

    function validatePasswordStrength(req, password, cb) {

        var i18n = req.i18n;

        password = password || '';

        if (
            (password.trim() === '') &&
            (password.trim().length < 6)
        ) {
            return cb(new ErrorHandled(i18n.__("AccountResources.InvalidPassword")));
        }

        return cb(null, {});
    }

    function validate(req, obj, cb) {

        var i18n = req.i18n;

        validatePasswordStrength(req, obj.password, function(err, valPassword) {

            var keyValuePair = [];
            var keyValuePairGet = function(key, value) {
                return {
                    key: key,
                    value: value
                };
            };

            if (err) {
                if (err instanceof ErrorHandled) {
                    keyValuePair.push(keyValuePairGet("password", err.message));
                } else {
                    return cb(err);
                }
            }

            if (obj.password !== obj.passwordConfirm) {
                keyValuePair.push(keyValuePairGet("passwordConfirmation", i18n.__("AccountResources.NewPasswordConfirmError")));
            }

            if (!validator.isEmail(obj.email)) {
                keyValuePair.push(keyValuePairGet("email", i18n.__("DataAnnotations.EmailNotValid")));
            }

            if (keyValuePair.length > 0) {
                return cb(new ErrorHandled(i18n.__("AccountResources.ThereAreErrorsInForm_SeeDetails"), keyValuePair));
            } else {
                return cb(null, {});
            }
        });



    }

})(module);