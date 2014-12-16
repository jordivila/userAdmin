(function(module) {

    "use strict";

    var log = require('../libs/log')(module);

    var validator = require('validator');
    var UserModel = require('../models/users');
    var DataResultModel = require('../models/dataResult');
    var ErrorHandledModel = require('../models/errorHandled');
    var UserValidator = require('../models/users.validate.client');
    var usersInRolesController = require('./usersInRoles');
    var tokenTempController = require('./tokenTemp');


    module.exports.create = create;
    module.exports.confirmEmail = confirmEmail;
    module.exports.getById = getById;
    module.exports.setRoutes = setRoutes;

    function create(req, i18n, cb) {

        UserValidator.validate(req, i18n, validator, function(err, resultValidation) {
            if (err) return cb(err);
            if (!resultValidation.isValid) return cb(null, resultValidation);


            var userReqModel = new UserModel(req);

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

    function confirmEmail(tokenGuid, i18n, cb) {

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

                    return cb(null, new DataResultModel(true, i18n.__("User email confirmed"), {}));
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