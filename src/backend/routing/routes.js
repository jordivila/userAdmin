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
    }


    module.exports.setRoutes = function (app, log, authController) {


        // set up the middleware
        app.use(function (req, res, next) {

            languagesController.initRequestLanguage(req, res);
            themesController.initRequestTheme(req, res);
            commonController.setViewModelBase(req);

            next();
        });











        /**************************************************/
        /*              VIEW ROUTES                       */
        /**************************************************/


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


        app.put('/languages/*', function (req, res, next) {
            languagesController.update(req, res, next);
        });


        registerCommonGets(app, "themes", themesController);
        app.put('/themes/*', function (req, res, next) {
            themesController.update(req, res, next);
        });


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




        /**************************************************/
        /*              API ROUTES                        */
        /**************************************************/


        /*api begin*/

        app.get('/api/user', [
            authController.isAuthenticated,
            function (req, res, next) {
                usersController.getById(req.user.userId, function (err, userInfo) {
                    if (err) return next(err);

                    res.json({
                        email: userInfo.email
                    });

                    res.end();
                });
            }
        ]);

        app.post('/api/user', function (req, res, next) {
            var result = usersController.create(req, req.body, function (err, user) {
                if (err) return next(err);

                res.json(user);
            });
        });

        app.get('/api/users/confirmation/:tokenId', [
            function (req, res, next) {
                usersController.confirmEmail(
                    req,
                    req.params.tokenId,
                    function (err, confirmResult) {
                        if (err) return next(err);

                        res.json(confirmResult);
                    });
            }
        ]);

        app.put('/api/user/lastActivity', [
            //authController.isAuthenticated,
            function (req, res, next) {

                // If user is authenticated -> update user last activity 

                res.json({

                });

                res.end();
            }
        ]);

        app.get('/api/user/menu', [
            //authController.isAuthenticated, ????
            function (req, res, next) {


                var i18n = req.i18n;



                res.json([
                    {
                        url: "/user/logon/",
                        text: i18n.__("AccountResources.LogOn"),
                    },
                    {
                        url: "/home/",
                        text: i18n.__("GeneralTexts.Home")
                    },
                    {
                        url: "/about/",
                        text: i18n.__("GeneralTexts.About")
                    },
                    {
                        url: "/languages/",
                        text: i18n.__("GeneralTexts.Languages")
                    },
                    {
                        url: "/themes/",
                        text: i18n.__("GeneralTexts.SiteThemes")
                    },
                    {
                        text: "UI Controls",
                        childs: [
                            {
                                text: "Menu",
                                childs: [
                                    {
                                        url: "/uicontrols/menu/menuTree/",
                                        text: "Menu Tree"
                                    },
                                    {
                                        url: "/uicontrols/menu/menuSlides/",
                                        text: "Menu Slides"
                                    },
                                ]
                            },
                            {
                                text: "Grid widget",
                                childs: [
                                    {
                                        url: "/uicontrols/crud/crudGridSimple/",
                                        text: "Basic Grid"
                                    },
                                    {
                                        url: "/uicontrols/crud/crudGridSearch/",
                                        text: "Search & paginate"
                                    },
                                    {
                                        url: "/uicontrols/crud/crudGridSearchDirect/",
                                        text: "Search filter on top"
                                    },
                                    {
                                        url: "/uicontrols/crud/crudGridPagination/",
                                        text: "Pagination config"
                                    },
                                    {
                                        url: "/uicontrols/crud/crudScrollable/",
                                        text: "Scrollable"
                                    },
                                    {
                                        url: "/uicontrols/crud/crudExpand/",
                                        text: "Expand grid & resize"
                                    },
                                ],
                            },
                            {
                                text: "Crud widget",
                                childs: [
                                    {
                                        url: "/uicontrols/crud/crudFormSimple/",
                                        text: "CRUD Simple form"
                                    },
                                    {
                                        url: "/uicontrols/crud/crudFormExtended/",
                                        text: "CRUD Extended"
                                    },
                                ],
                            },
                        ]
                    },
                ]);

                res.end();
            }
        ]);

        /*api end*/





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