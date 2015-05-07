(function (module) {

    "use strict";

    //var config = require('../libs/config');
    //var pkg = require('../../../package.json');
    //var i18n = require('i18n-2');
    //var util = require('../libs/commonFunctions');
    //var utilsNode = require('util');
    //var DataResult = require('../models/dataResult');
    //var ErrorHandled = require('../models/errorHandled.js');
    var commonController = require('../controllers/common');
    //var usersController = require('../controllers/users');
    var languagesController = require('../controllers/languages');
    var homeController = require('../controllers/home');
    var themesController = require('../controllers/themes');


    function registerCommonGets(app, route, controller) {
        app.get('/' + route + '/', function (req, res, next) {
            commonController.setViewInfo(app, req, route);
            controller.index(app, req, res, next);
        });

        app.get('/' + route + '/index.handlebars.json', function (req, res, next) {
            commonController.setViewInfo(app, req, route);
            controller.indexJSON(app, req, res, next);
        });

        app.get('/' + route + '/*', function (req, res, next) {

            var pathName = req._parsedUrl.pathname.replace('', '');

            res.sendFile(pathName, {
                root: app.get('views')
            }, function (err) {
                if (err) {
                    res.status(err.status);
                    next();
                }
            });
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


        registerCommonGets(app, "home", homeController);
        registerCommonGets(app, "languages", languagesController);
        registerCommonGets(app, "themes", themesController);


        app.get('/uicontrols/*/*', function (req, res, next) {

            if (req.params[1] === '') {

                //get template json config -> jsFiles, CssFiles, controllerInterface, etc
                var modelTemplate = utilsNode.format(app.get('views') + '/%s/index.handlebars.json', req.params[0]);

                //extend common layout model with template config
                var m = util.extend(req.myInfo, require(modelTemplate));

                //do render     
                if (m.IsSEORequest) {
                    //render SEO friendly layout + template
                    res.render(req.params[0] + '/index.handlebars', m);
                }
                else {
                    //return template and let frontend engine render results
                    res.sendFile(req.params[0] + '/index.handlebars', {
                        root: app.get('views')
                    });
                }
            }
            else {
                // browser requesting a resource -> *.js, *.png, *.css
                var pathName = req._parsedUrl.pathname.replace('/uicontrols', '');
                res.sendFile(pathName, {
                    root: app.get('views')
                });

            }
        });

    };

})(module);