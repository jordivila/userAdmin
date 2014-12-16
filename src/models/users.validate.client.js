(function(name, definition) {
    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        module.exports = definition();
    } else if (typeof define === 'function' && typeof define.amd === 'object') {
        define(definition);
    } else {
        this[name] = definition();
    }
})('userValidator', function(userValidator) {

    'use strict';

    userValidator = {
        version: '0.0.1'
    };

    userValidator.extend = function(name, fn) {
        userValidator[name] = function() {
            var args = Array.prototype.slice.call(arguments);
            args[0] = userValidator.toString(args[0]);
            return fn.apply(userValidator, args);
        };
    };

    userValidator.validate = function(obj, i18n, validator, cb) {

        try {

            var result = {
                isValid: true,
                messages: []
            };


            if (
                (validator.toString(obj.password).trim() === '') &&
                (validator.toString(obj.password).trim().length < 6)
            ) {
                result.isValid = false;
                result.messages.push({
                    password: i18n.__("Invalid password")
                });
            }

            if (validator.toString(obj.password) !== validator.toString(obj.passwordConfirm)) {
                result.isValid = false;
                result.messages.push({
                    passwordConfirmation: i18n.__("Password and confirmation do not match")
                });
            }

            if (!validator.isEmail(obj.email)) {
                result.isValid = false;
                result.messages.push({
                    email: i18n.__("Invalid email address")
                });
            }

            return cb(null, result);

        } catch (e) {

            return cb(e);
        }


    };

    return userValidator;

});