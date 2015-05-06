(function (module) {

    "use strict";

    module.exports.setAccessControlOrigin = setAccessControlOrigin;
    module.exports.initTestEnvironment = initTestEnvironment;
    module.exports.initDb = initDb;
    module.exports.getModelBase = getModelBase;
    module.exports.setViewInfo = setViewInfo;
    module.exports.setCookie = setCookie;


    var userController = require('./users');
    var roleController = require('./usersRoles');

    var mongoose = require('mongoose');
    var config = require('../libs/config');
    var ErrorHandled = require('../models/errorHandled.js');
    var pkg = require('../../../package.json');
    var util = require('../libs/commonFunctions');
    //var util = require('util');



    function initDb(req, cb) {

        var i18n = req.i18n;
        var newRole = {
            name: "Guest"
        };

        function clearDB() {

            // I tested few ways of doing the same thing

            // 1.- This one is the slowest one (in execution time). 
            //     But needs no maintenance 

            //mongoose.connection.db.dropDatabase(function(err, result) {
            //    createRoleGuest();
            //});

            // 2.- This one is faster than the fiorst one (in execution time). 
            //     Removes all documents in all collections in db 


            var modelsInDb = mongoose.connection.modelNames();
            var modelCounter = 0;
            var modelRemoveTrack = null;
            modelRemoveTrack = function (err, rowsAffected) {

                if (err) {
                    console.error(err);
                }

                modelCounter++;

                if (modelCounter < modelsInDb.length) {
                    mongoose.connection.model(modelsInDb[modelCounter]).remove(modelRemoveTrack);
                }
                else {
                    createRoleGuest();
                }
            };

            mongoose.connection.model(modelsInDb[modelCounter]).remove(modelRemoveTrack);
        }
        function createRoleGuest() {

            var newRole = {
                name: "Guest"
            };

            roleController.create(newRole, i18n, function (errRole, roleCreated) {
                if (errRole) return cb(errRole);

                return cb(null, roleCreated);
            });
        }


        if (mongoose.connection.readyState === 0) {

            mongoose.connect(config.get('mongoose:uri'), function (err) {
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
        app.use(function (req, res, next) {

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

    function getModelBase(req) {

        var i18n = req.i18n;

        var m = {
            Title: '',
            DomainName: config.get('domainName'),
            Package: {
                name: pkg.name,
                version: pkg.version
            },
            IsTest: config.get('IsTestEnv'),
            Theme: req.cookies[config.get('themes:cookieName')] ? req.cookies[config.get('themes:cookieName')] : config.get('themes:default'),
            Globalization: {
                cultureSelected: i18n.locale,
                cultureGlobalization: i18n.locale,
                cultureDatePicker: i18n.locale,
            },
            // Indica si la pagina viene de una peticion del menu o viene de una peticion para SEO
            IsSEORequest: (req.query.seoRequest === undefined),
            //Breadcrumb: [
            //{ title: i18n.__("GeneralTexts.BreadcrumbNavigation") },
            //{ title: i18n.__("GeneralTexts.Home"), url: "/" }
            //],
            CssFiles: [
                //"/public/views/home/home.css",
            ],
            JsFiles: [
                //"/public/views/home/home.js",
            ],
        };

        req.myInfo = m;

    }

    function setViewInfo(app, req, route) {
        var viewPath = route + '/index.handlebars';
        var viewModelPath = app.get('views') + '/' + viewPath + '.json';

        req.myInfo = util.extend(req.myInfo, require(viewModelPath));
        req.myInfo.viewPath = viewPath;
        req.myInfo.viewModelPath = viewModelPath;
    }

    function setCookie(res, name, value) {
        res.cookie(name, value, { expires: new Date(Date.now() + 900000), httpOnly: true });
    }

})(module);