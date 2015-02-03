(function(module) {

    "use strict";

    module.exports.setRoutes = setRoutes;
    module.exports.setAccessControlOrigin = setAccessControlOrigin;
    module.exports.initTestEnvironment = initTestEnvironment;

    var userController = require('./users');
    var roleController = require('./usersRoles');
    var util = require('util');
    var mongoose = require('mongoose');
    var config = require('../libs/config');
    var ErrorHandled = require('../models/errorHandled.js');


    function setRoutes(app, log) {

        if (process.env.node_env === 'test') {
            app.get("/initDb", function(req, res, next) {
                initDb(req, function(err, roleCreated) {
                    if (err) return next(err);

                    res.json(roleCreated);
                });
            });
        }

        //catch 404
        app.use(function(req, res, next) {
            res.status(404);
            res.send({});

            log.info('Not found URL: %s', req.url);
        });

        //operational errors
        app.use(function(err, req, res, next) {
            
            if (!err) return next();
            
            if (err instanceof ErrorHandled) {
                res.send(err.toDataResult());
                res.status(200);
                res.end();
                return next();
            }

            console.log(err.message);
            console.log(err.stack);

            log.error(err);
            res.status(err.status || 500);
            res.send({}); // do not send error messages as it can send private info

        });
    }

    function initDb(req, cb) {

        var i18n = req.i18n;
        var newRole = {
            name: "Guest"
        };


        function createRoleGuest() {

            var newRole = {
                name: "Guest"
            };

            roleController.create(newRole, i18n, function(errRole, roleCreated) {
                if (errRole) return cb(errRole);

                return cb(null, roleCreated);
            });
        }

        function clearDB() {

            mongoose.connection.db.dropDatabase(function(err, result) {
                createRoleGuest();
            });
        }

        if (mongoose.connection.readyState === 0) {

            mongoose.connect(config.get('mongoose:uri'), function(err) {
                if (err) {
                    throw err;
                }
                return clearDB();
            });
        } else {
            return clearDB();
        }

    }

    function initTestEnvironment(app) {
        setAccessControlOrigin(app);
    }

    function setAccessControlOrigin(app) {
        // This is not intended for production environments
        app.use(function(req, res, next) {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Access-Control-Allow-Headers', 'Authorization');
            // Pass to next layer of middleware
            next();
        });
    }

})(module);