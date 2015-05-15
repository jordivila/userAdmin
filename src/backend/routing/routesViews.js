(function (module) {

    "use strict";

    var LanguagesController = require('../controllers/languages');
    var HomeController = require('../controllers/home');
    var ThemesController = require('../controllers/themes');
    var GlobalizeController = require('../controllers/globalize');
    var BaseController = require('../controllers/classes/base');

    var languagesController = new LanguagesController();
    var homeController = new HomeController();
    var themesController = new ThemesController();
    var globalizeController = new GlobalizeController();
    var baseController = new BaseController();

    function registerCommonVerbs(app, route, controller) {

        // set up the middleware
        app.use('/' + route + '/*', function (req, res, next) {

            baseController.setViewModelBase(req);

            next();
        });

        app.get('/' + route + '/*', function (req, res, next) {

            var requestingView = (!req.params[0]);
            var requestingViewModel = (req.params[0] == 'index.handlebars.json');

            if (requestingView || requestingViewModel) {
                
                controller.setViewInfo(app, req, route);

                if (requestingView) {
                    controller.viewIndex(app, req, res, next);
                }
                else {
                    controller.viewIndexJson(app, req, res, next);
                }

            }
            else {
                var pathName = req._parsedUrl.pathname.replace('', '');

                res.sendFile(pathName, {
                    root: app.get('views')
                }, function (err) {
                    if (err) {
                        res.status(err.status);
                        next();
                    }
                });
            }
        });

        app.put('/' + route + '/*', function (req, res, next) {
            controller.update(req, res, next);
        });

    }

    module.exports.setRoutes = function (app) {

        app.get('/', function (req, res, next) {

            res.writeHead(301,
              {
                  Location: '/home/'// + newRoom
              }
            );
            res.end();
        });

        registerCommonVerbs(app, "home", homeController);
        registerCommonVerbs(app, "languages", languagesController);
        registerCommonVerbs(app, "themes", themesController);
        registerCommonVerbs(app, "globalize/serverside", globalizeController);
        registerCommonVerbs(app, "globalize/clientside", globalizeController);

    };

})(module);