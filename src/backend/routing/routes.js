(function (module) {

    "use strict";

    var config = require('../libs/config');
    var pkg = require('../../../package.json');
    var i18n = require('i18n-2');
    var util = require('../libs/commonFunctions');
    var utilsNode = require('util');
    var DataResult = require('../../crossLayer/models/dataResult');
    var ErrorHandled = require('../../crossLayer/models/errorHandled');
    var testsController = require('../controllers/tests');
    var LanguagesController = require('../controllers/languages');
    var CurrenciesController = require('../controllers/currencies');
    var ThemesController = require('../controllers/themes');
    var BaseController = require('../controllers/classes/base');

    var routerApiUser = require('./routesApiUser');
    var routerViews = require('./routesViews');
    var routerStatics = require('./routesStatics');

    var languagesController = new LanguagesController();
    var currenciesController = new CurrenciesController();
    var themesController = new ThemesController();
    var baseController = new BaseController();

    module.exports.setRoutes = function (app, log, authController) {


        // set up the middleware
        app.use(function (req, res, next) {

            languagesController.initRequest(req, res);
            themesController.initRequest(req, res);
            currenciesController.initRequest(req, res);


            // do not setViewModelBase here
            // otherwise viewModelBase will be set
            // even when requesting jpg, bmp, pdf, etc
            //baseController.setViewModelBase(req);

            next();
        });

        routerViews.setRoutes(app);
        routerStatics.setRoutes(app);
        routerApiUser.setRoutes(app, log, authController);
        



        /*begin common routes -> 404, 500, etc*/

        if (config.get('IsTestEnv') === true) {

            app.get("/tests/initDb", function (req, res, next) {
                testsController.initDb(req, function (err, roleCreated) {
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

            baseController.setViewModelBase(req);

            if (req.viewModel.isSEORequest) {
                res.status(404);
                res.render("errors/404/index.handlebars", req.viewModel);
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


            console.error(err);
            log.error(err);
            res.status(err.status || 500);


            /*************************************************
                    beautify internal server errors

            /**************************************************/
            if (!req.viewModel)
            {
                baseController.setViewModelBase(req);
            }

            if (req.viewModel.isSEORequest) {
                res.render("errors/500/index.handlebars", req.viewModel);
            }
            else {
                res.send({}); // do not send error messages as it can send private info
            }
            /*************************************************
                    end beautify internal server errors
            /**************************************************/




            //log.error(err);
            //res.status(err.status || 500);
            //res.send({}); // do not send error messages as it can send private info

        });

        /*end common routes -> 404, 500, etc*/

    };

})(module);