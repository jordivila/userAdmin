(function(module) {

    "use strict";

    module.exports.create = create;
    module.exports.confirmEmail = confirmEmail;
    module.exports.getById = getById;
    module.exports.cantAccessYourAccount = cantAccessYourAccount;
    module.exports.resetPassword = resetPassword;
    module.exports.setRoutes = setRoutes;


    var log = require('../libs/log')(module);
    var util = require('util');
    var validator = require('validator');
    var MailMessage = require('../models/mailMessage');
    var UserModel = require('../models/users');
    var DataResultModel = require('../models/dataResult');
    var ErrorHandledModel = require('../models/errorHandled');
    var UserValidator = require('../models/users.validate.client');
    var usersInRolesController = require('./usersInRoles');
    var mailingController = require('./mailing');
    var tokenTempController = require('./tokenTemp');

    function resetPassword(req, params, cb) {
        var i18n = req.i18n;
        var token = params.token;
        var newPassword = params.newPassword;
        var confirmNewPassword = params.confirmNewPassword;

        UserValidator.validatePasswordStrength(req, newPassword, function(err, resultValidation) {
            if (err) return cb(err);

            if (newPassword != confirmNewPassword)
                return cb(new ErrorHandledModel(i18n.__("AccountResources.NewPasswordConfirmError")));



            tokenTempController.getByGuid(token, function(err, token) {
                if (err) return cb(err);
                if (!token) return cb(new ErrorHandledModel(i18n.__("AccountResources.CantAccessYourAccount_TokenExpired")));

                var userId = JSON.parse(token.jsonObject).userId;

                getById(userId, function(err, user) {
                    if (err) return cb(err);
                    if (!user) return cb(new ErrorHandledModel(i18n.__("UserAdminTexts.UserNotFound")));


                    user.password = newPassword;
                    user.passwordLastChanged = new Date();

                    user.save(function(err) {
                        if (err) return cb(err);

                        tokenTempController.deleteByGuid(token, function(err, tokenDeleteResult) {
                            if (err) return cb(err);

                            mailingController.resetPassword(
                                req,
                                user,
                                token,
                                function(err, mailingResult) {
                                    if (err) return cb(err);

                                    var resultData = {};

                                    if (process.env.node_env === 'test') {
                                        resultData = {
                                            userId: user.userId,
                                            tokenId: token.guid
                                        };
                                    } else {
                                        //send token via email
                                        return cb(new ErrorHandledModel(i18n.__("Not implemented")));
                                    }

                                    return cb(null,
                                        new DataResultModel(
                                            true,
                                            i18n.__("AccountResources.CantAccessYourAccount_PasswordChanged"),
                                            resultData));
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
            function(err, user) {
                if (err) return cb(err);
                if (!user) return cb(new ErrorHandledModel(i18n.__("UserAdminTexts.UserNotFound")));

                tokenTempController.create(
                    new Date(),
                    JSON.stringify({
                        userId: user.userId
                    }),
                    i18n,
                    function(err, token) {
                        if (err) return cb(err);

                        mailingController.cantAccessYourAccount(
                            req,
                            activateFormVirtualPath,
                            user,
                            token,
                            function(err, mailingResult) {
                                if (err) return cb(err);

                                var resultData = {};

                                if (process.env.node_env === 'test') {
                                    resultData = {
                                        userId: user.userId,
                                        tokenId: token.guid
                                    };
                                } else {
                                    //send token via email
                                    return cb(new ErrorHandledModel(i18n.__("Not implemented")));
                                }


                                return cb(null, new DataResultModel(true, i18n.__("AccountResources.CreateNewAccount_EmailSent"), resultData));
                            });
                    });
            });
    }

    function create(req, params, cb) {

        var i18n = req.i18n;

        UserValidator.validate(req, params, function(err, resultValidation) {
            if (err) return cb(err);

            var userReqModel = new UserModel(params);

            UserModel.findOne({
                    email: userReqModel.email
                },
                function(err, user) {

                    if (err) return cb(err);
                    if (user) return cb(new ErrorHandledModel(i18n.__("UserAdminTexts.DuplicateEmail")));


                    userReqModel.save(function(err, userCreated) {

                        if (err) return cb(err);

                        usersInRolesController.addToRole(
                            userCreated.userId,
                            "Guest",
                            i18n,
                            function(err, userInRoleAdded) {
                                if (err) return cb(err);

                                tokenTempController.create(
                                    new Date(),
                                    JSON.stringify({
                                        userId: userCreated.userId
                                    }),
                                    i18n,
                                    function(err, token) {
                                        if (err) return cb(err);

                                        var resultData = {};

                                        if (process.env.node_env === 'test') {
                                            resultData = {
                                                userId: userCreated.userId,
                                                tokenId: token.guid
                                            };
                                        } else {
                                            //send token via email
                                            return cb(new ErrorHandledModel(i18n.__("Not implemented")));
                                        }

                                        return cb(null,
                                            new DataResultModel(
                                                true,
                                                i18n.__("AccountResources.CreateNewAccount_EmailSent"),
                                                resultData));
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

        tokenTempController.getByGuid(tokenGuid, function(err, token) {
            if (err) return cb(err);
            if (!token) return cb(new ErrorHandledModel(i18n.__("AccountResourcesTexts.CantAccessYourAccount_TokenExpired")));

            var userId = JSON.parse(token.jsonObject).userId;

            getById(userId, function(err, user) {
                if (err) return cb(err);
                if (!user) return cb(new ErrorHandledModel(i18n.__("UserAdminTexts.UserNotFound")));


                user.isEmailConfirmed = true;
                user.save(function(err) {
                    if (err) return cb(err);

                    tokenTempController.deleteByGuid(tokenGuid, function(err, tokenDeleteResult) {
                        if (err) return cb(err);

                        return cb(null, new DataResultModel(true, i18n.__("AccountResourcesTexts.AccountActivated"), {}));
                    });
                });
            });
        });
    }

    function setRoutes(app, authController) {

        app.get('/api/user', [
            authController.isAuthenticated,
            function(req, res, next) {
                getById(req.user.userId, function(err, userInfo) {
                    if (err) return next(err);

                    res.json({
                        email: userInfo.email
                    });

                    res.end();
                });
            }
        ]);

        app.post('/api/user', function(req, res, next) {
            var result = create(req, req.body, function(err, user) {
                if (err) return next(err);

                res.json(user);
            });
        });

        app.get('/api/users/confirmation/:tokenId', [
            function(req, res, next) {
                confirmEmail(
                    req,
                    req.params.tokenId,
                    function(err, confirmResult) {
                        if (err) return next(err);

                        res.json(confirmResult);
                    });
            }
        ]);

        app.put('/api/user/lastActivity', [
            //authController.isAuthenticated,
            function(req, res, next) {

                // If user is authenticated -> update user last activity 

                res.json({

                });

                res.end();
            }
        ]);



        app.get('/api/user/menu', [
            //authController.isAuthenticated,
            function(req, res, next) {

                res.json([{
                    url: "/user/logon",
                    text: "Log on",
                }, {
                    url: "/",
                    text: "Inicio"
                }, {
                    url: "/blog",
                    text: "Blog"
                }, {
                    url: "/about",
                    text: "Acerca de"
                }, {
                    url: "/user/languages",
                    text: "Idiomas"
                }]);

                res.end();
            }
        ]);

    }

})(module);