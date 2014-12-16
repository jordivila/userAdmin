(function(module) {

    "use strict";

    var log = require('../libs/log')(module);

    var validator = require('validator');
    var UserModel = require('../models/users');
    var DataResultModel = require('../models/dataResult');
    var ErrorHandledModel = require('../models/errorHandled');
    var UserValidator = require('../models/users.validate.client');
    var usersInRolesController = require('./usersInRoles');

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

                                return cb(null, new DataResultModel(true, i18n.__("User created"), {
                                    userId: userCreated.userId
                                }));
                            });
                    });
                });
        });
    }

    function getById(userId, cb) {
        UserModel.findById(userId, cb);
    }


    module.exports.create = create;
    module.exports.getById = getById;

    module.exports.setRoutes = function(app, authController) {

        app.get('/api/user', [
            authController.isAuthenticated,
            function(req, res, next) {
                var user = req.user;
                res.json(user); // passport sets user object when authenticated
            }
        ]);

        app.post('/api/user', function(req, res, next) {
            var result = create(req.body, req.i18n, function(err, user) {
                if (err) {
                    next(err);
                } else {
                    res.json(user);
                }
            });
        });
    };

})(module);