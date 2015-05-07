(function (module) {

    "use strict";

    var commonController = require('../controllers/common');
    var languagesController = require('../controllers/languages');
    var homeController = require('../controllers/home');
    var themesController = require('../controllers/themes');


    function registerCommonGets(app, route, controller) {

        app.get('/' + route + '/*', function (req, res, next) {

            var requestingView = (!req.params[0]);
            var requestingViewModel = (req.params[0] == 'index.handlebars.json');

            if (requestingView || requestingViewModel) {
                
                commonController.setViewInfo(app, req, route);

                if (requestingView) {
                    controller.index(app, req, res, next);
                }
                else {
                    controller.indexJSON(app, req, res, next);
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