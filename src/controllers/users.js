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
                    if (!user) return cb(new ErrorHandledModel(i18n.__("User not found")));


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

                                    return cb(null, new DataResultModel(true, i18n.__("AccountResources.CantAccessYourAccount_PasswordChanged"), {
                                        userId: user.userId,
                                        tokenId: token.guid
                                    }));
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
                if (!user) return cb(new ErrorHandledModel(i18n.__("User not found")));

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

                                return cb(null, new DataResultModel(true, i18n.__("An email was sent to the email address provided"), {
                                    userId: user.userId,
                                    tokenId: token.guid
                                }));
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
                    if (user) return cb(new ErrorHandledModel(i18n.__("User already exists")));


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

                                        return cb(null, new DataResultModel(true, i18n.__("User created"), {
                                            userId: userCreated.userId,
                                            tokenId: token.guid
                                        }));
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
            if (!token) return cb(new ErrorHandledModel(i18n.__("Token no exists or token expired")));

            var userId = JSON.parse(token.jsonObject).userId;

            getById(userId, function(err, user) {
                if (err) return cb(err);
                if (!user) return cb(new ErrorHandledModel(i18n.__("User not found")));


                user.isEmailConfirmed = true;
                user.save(function(err) {
                    if (err) return cb(err);

                    tokenTempController.deleteByGuid(tokenGuid, function(err, tokenDeleteResult) {
                        if (err) return cb(err);

                        return cb(null, new DataResultModel(true, i18n.__("User email confirmed"), {}));
                    });
                });
            });
        });
    }

    function setRoutes(app, authController) {
        app.get('/api/user', [
            authController.isAuthenticated,
            function(req, res, next) {
                var user = req.user;
                res.json(user); // passport sets user object when authenticated
            }
        ]);

        app.post('/api/user', function(req, res, next) {
            var result = create(req.body, req.i18n, function(err, user) {
                if (err) return next(err);

                res.json(user);
            });
        });
    }

})(module);