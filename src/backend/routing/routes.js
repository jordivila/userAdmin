(function (module) {

    "use strict";

    var config = require('../libs/config');
    var pkg = require('../../../package.json');
    var i18n = require('i18n-2');
    var util = require('../libs/commonFunctions');
    var utilsNode = require('util');
    var DataResult = require('../models/dataResult');
    var ErrorHandled = require('../models/errorHandled.js');
    var commonController = require('../controllers/common');
    var usersController = require('../controllers/users');
    var languagesController = require('../controllers/languages');
    var homeController = require('../controllers/home');
    var themesController = require('../controllers/themes');


    var routerApiUser = require('./routesApiUser');
    var routerViews = require('./routesViews');
    var routerViewsCustom = require('./routesViewsCustom');


    module.exports.setRoutes = function (app, log, authController) {


        // set up the middleware
        app.use(function (req, res, next) {

            languagesController.initRequestLanguage(req, res);
            themesController.initRequestTheme(req, res);
            commonController.setViewModelBase(req);

            next();
        });


        
        routerViews.setRoutes(app);
        routerViewsCustom.setRoutes(app);
        routerApiUser.setRoutes(app, log, authController);
        



        /*begin common routes -> 404, 500, etc*/

        if (config.get('IsTestEnv') === true) {

            app.get("/tests/initDb", function (req, res, next) {
                commonController.initDb(req, function (err, roleCreated) {
                    if (err) return next(err);

                    res.json(roleCreated);
                });
            });

            app.get('/tests/*', function (req, res, next) {

                res.sendFile('test/qunit/' + req.params[0], {
                    //root: app.get('root') + (config.get('NODE_ENV') === 'test' ? '../../' : '')
                    root: app.get('root') + '../../'
                });
            });

        }

        //catch 404
        app.use(function (req, res, next) {
            if (req.myInfo.IsSEORequest) {
                res.render("errors/404/index.handlebars", req.myInfo);
            }
            else {
                res.status(404);
                res.send({});
                log.info('Not found URL: %s', req.url);
            }
        });

        //operational errors
        app.use(function (err, req, res, next) {

            if (!err) return next();

            if (err instanceof ErrorHandled) {

                res.send(err.toDataResult());
                res.status(200);
                res.end();
                return next();
            }

            log.error(err);
            res.status(err.status || 500);
            res.send({}); // do not send error messages as it can send private info

        });

        /*end common routes -> 404, 500, etc*/

    };

})(module);