(function (module) {

    "use strict";

    module.exports.create = create;
    module.exports.confirmEmail = confirmEmail;
    module.exports.getById = getById;
    module.exports.cantAccessYourAccount = cantAccessYourAccount;
    module.exports.resetPassword = resetPassword;


    var log = require('../libs/log')(module);
    var config = require('../libs/config');
    var util = require('util');
    var validator = require('validator');
    var UserModel = require('../models/users');
    var DataResultModel = require('../../crossLayer/models/dataResult');
    var ErrorHandledModel = require('../../crossLayer/models/errorHandled');
    var UserValidator = require('../models/users.validate.client');
    var usersInRolesController = require('./usersInRoles');
    var mailingController = require('./mailing');
    var tokenTempController = require('./tokenTemp');

    function resetPassword(req, params, cb) {
        var i18n = req.i18n;
        var token = params.token;
        var newPassword = params.newPassword;
        var confirmNewPassword = params.confirmNewPassword;

        UserValidator.validatePasswordStrength(req, newPassword, function (err, resultValidation) {
            if (err) return cb(err);

            if (newPassword != confirmNewPassword)
                return cb(new ErrorHandledModel(i18n.__("AccountResources.NewPasswordConfirmError")));



            tokenTempController.getByGuid(token, function (err, token) {
                if (err) return cb(err);
                if (!token) return cb(new ErrorHandledModel(i18n.__("AccountResources.CantAccessYourAccount_TokenExpired")));

                var userId = JSON.parse(token.jsonObject).userId;

                getById(userId, function (err, user) {
                    if (err) return cb(err);
                    if (!user) return cb(new ErrorHandledModel(i18n.__("UserAdminTexts.UserNotFound")));


                    user.password = newPassword;
                    user.passwordLastChanged = new Date();

                    user.save(function (err) {
                        if (err) return cb(err);

                        tokenTempController.deleteByGuid(token, function (err, tokenDeleteResult) {
                            if (err) return cb(err);

                            mailingController.resetPassword(
                                req,
                                user,
                                token,
                                function (err, mailingResult) {

                                    if (err) return cb(err);

                                    if (config.get('IsTestEnv') === true) {

                                        var resultData = {
                                            userId: user.userId,
                                            tokenId: token.guid
                                        };

                                        return cb(null,
                                            new DataResultModel(
                                                true,
                                                i18n.__("AccountResources.CantAccessYourAccount_PasswordChanged"),
                                                resultData));

                                    } else {
                                        //send token via email
                                        return cb(new ErrorHandledModel(i18n.__("GeneralTexts.NotImplemented")));
                                    }

                                });
                        });
                    });
                });
            });



        });
    }

    function cantAccessYourAccount(req, params, cb) {

        var i18n = req.i18n;
        var activateFormVirtualPath = params.activateFormVirtualPath;
        var email = params.email;

        UserModel.findOne({
            email: email
        },
            function (err, user) {
                if (err) return cb(err);
                if (!user) return cb(new ErrorHandledModel(i18n.__("UserAdminTexts.UserNotFound")));

                tokenTempController.create(
                    new Date(),
                    JSON.stringify({
                        userId: user.userId
                    }),
                    i18n,
                    function (err, token) {
                        if (err) return cb(err);

                        mailingController.cantAccessYourAccount(
                            req,
                            activateFormVirtualPath,
                            user,
                            token,
                            function (err, mailingResult) {
                                if (err) return cb(err);

                                var resultData = {};

                                if (config.get('IsTestEnv') === true) {
                                    resultData = {
                                        userId: user.userId,
                                        tokenId: token.guid
                                    };
                                } else {
                                    //send token via email
                                    return cb(new ErrorHandledModel(i18n.__("GeneralTexts.NotImplemented")));
                                }


                                return cb(null, new DataResultModel(true, i18n.__("AccountResources.CreateNewAccount_EmailSent"), resultData));
                            });
                    });
            });
    }

    function create(req, params, cb) {

        var i18n = req.i18n;

        UserValidator.validate(req, params, function (err, resultValidation) {
            if (err) return cb(err);

            var userReqModel = new UserModel(params);

            UserModel.findOne({
                email: userReqModel.email
            },
                function (err, user) {

                    if (err) return cb(err);
                    if (user) return cb(new ErrorHandledModel(i18n.__("UserAdminTexts.DuplicateEmail")));


                    userReqModel.save(function (err, userCreated) {

                        if (err) return cb(err);

                        usersInRolesController.addToRole(
                            userCreated.userId,
                            "Guest",
                            i18n,
                            function (err, userInRoleAdded) {
                                if (err) return cb(err);

                                tokenTempController.create(
                                    new Date(),
                                    JSON.stringify({
                                        userId: userCreated.userId
                                    }),
                                    i18n,
                                    function (err, token) {
                                        if (err) return cb(err);

                                        var resultData = {};

                                        if (config.get('IsTestEnv') === true) {
                                            // just when IsInTest
                                            // because this data will be sent to client browser
                                            resultData = {
                                                userId: userCreated.userId,
                                                tokenId: token.guid
                                            };
                                        }

                                        mailingController.createNewAccount(
                                            req,
                                            userCreated,
                                            token,
                                            function (err, mail) {
                                                if (err) return cb(err);
                                                // return cb(new ErrorHandledModel(i18n.__("GeneralTexts.NotImplemented")));

                                                return cb(null,
                                                    new DataResultModel(
                                                        true,
                                                        i18n.__("AccountResources.CreateNewAccount_EmailSent"),
                                                        resultData
                                                    ));
                                            });
                                    });
                            });
                    });
                });
        });
    }

    function getById(userId, cb) {
        UserModel.findById(userId, cb);
    }

    function confirmEmail(req, tokenGuid, cb) {

        var i18n = req.i18n;

        tokenTempController.getByGuid(tokenGuid, function (err, token) {
            if (err) return cb(err);
            if (!token) return cb(new ErrorHandledModel(i18n.__("AccountResources.CantAccessYourAccount_TokenExpired")));

            var userId = JSON.parse(token.jsonObject).userId;

            getById(userId, function (err, user) {
                if (err) return cb(err);
                if (!user) return cb(new ErrorHandledModel(i18n.__("UserAdminTexts.UserNotFound")));


                user.isEmailConfirmed = true;
                user.save(function (err) {
                    if (err) return cb(err);

                    tokenTempController.deleteByGuid(tokenGuid, function (err, tokenDeleteResult) {
                        if (err) return cb(err);

                        return cb(null, new DataResultModel(true, i18n.__("AccountResources.AccountActivated"), {}));
                    });
                });
            });
        });
    }


})(module);