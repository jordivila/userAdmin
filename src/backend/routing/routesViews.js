(function (module) {

    "use strict";

    var config = require('../libs/config');
    var LanguagesController = require('../controllers/languages');
    var CurrenciesController = require('../controllers/currencies');
    var HomeController = require('../controllers/home');
    var ThemesController = require('../controllers/themes');
    var GlobalizeController = require('../controllers/globalize');
    var BaseController = require('../controllers/classes/base');
    var GenericViewController = require('../controllers/classes/genericView');

    var languagesController = new LanguagesController();
    var currenciesController = new CurrenciesController();
    var homeController = new HomeController();
    var themesController = new ThemesController();
    var globalizeController = new GlobalizeController();
    var baseController = new BaseController();
    var genericViewController = new GenericViewController();



    var helpdeskIsAuthenticated = require('../controllers/' + config.get('helpdesk:controllerType')).isAuthenticated;
    var HelpdeskAPIController = require('../controllers/' + config.get('helpdesk:controllerType')).HelpdeskAPIController;
    var HelpdeskViewHomeController = require('../controllers/helpdeskBase').HelpdeskViewHomeController;
    var HelpdeskViewMessageController = require('../controllers/helpdeskBase').HelpdeskViewMessageController;
    var HelpdeskViewAuthController = require('../controllers/' + config.get('helpdesk:controllerType')).HelpdeskViewAuthController;
    var HelpdeskViewUnAuthController = require('../controllers/helpdeskBase').HelpdeskViewUnAuthController;
    var HelpdeskViewLoadDataController = require('../controllers/helpdeskBase').HelpdeskViewLoadDataController;

    var helpdeskAPIController = new HelpdeskAPIController();
    var helpdeskViewHomeController = new HelpdeskViewHomeController(helpdeskAPIController);
    var helpdeskViewAuthController = new HelpdeskViewAuthController();
    var helpdeskViewUnAuthController = new HelpdeskViewUnAuthController();
    var helpdeskViewMessageController = new HelpdeskViewMessageController(helpdeskAPIController);
    var helpdeskViewLoadDataController = new HelpdeskViewLoadDataController(helpdeskAPIController);

    function registerCommonVerbs(app, route, controller, passportIsAuthFunc, cacheOn) {


        // set up the middleware
        app.use('/' + route + '/*', function (req, res, next) {

            baseController.setViewModelBase(req);

            next();
        });


        var getViewContentActions = [];

        if (typeof (passportIsAuthFunc) == 'function') {
            getViewContentActions.push(passportIsAuthFunc);
        }

        getViewContentActions.push(function (req, res, next) {

            var reqType = controller.getRequestType(req);

            if (reqType.isView || reqType.isViewModel) {

                controller.setViewInfo(app, req, route);

                if (cacheOn === false) {
                    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
                    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
                    res.setHeader("Expires", "0"); // Proxies.
                }

                if (reqType.isView) {
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

        app.get('/' + route, function (req, res, next) {

            res.writeHead(301,
              {
                  Location: req.originalUrl + "/"
              }
            );
            res.end();

        });

        app.get('/' + route + '/*', getViewContentActions);

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
        app.get('/public/locales/:localeId/clientMessages.json', [
            function (req, res, next) {

                //-> I dont really need param "localeId" as far as i18n library sets automatically
                var pLocale = req.params.localeId;
                //

                //var result = {};
                //result[req.i18n.locale] = req.i18n.locales[req.i18n.locale];
                //res.json(result);

                res.json(req.i18n.locales[req.i18n.locale]);
            }
        ]);

        registerCommonVerbs(app, "home", homeController);
        registerCommonVerbs(app, "languages", languagesController);
        registerCommonVerbs(app, "currencies", currenciesController);
        registerCommonVerbs(app, "themes", themesController);
        registerCommonVerbs(app, "globalize/serverside", globalizeController);
        registerCommonVerbs(app, "globalize/clientside", globalizeController);
        registerCommonVerbs(app, "menu/menuTree", genericViewController);
        registerCommonVerbs(app, "menu/menuSlides", genericViewController);
        registerCommonVerbs(app, "breadcrumb/singleItem", genericViewController);
        registerCommonVerbs(app, "breadcrumb/multipleItems", genericViewController);
        registerCommonVerbs(app, "breadcrumb/clientSideBuild", genericViewController);
        registerCommonVerbs(app, "breadcrumb/clientSideFunction", genericViewController);
        registerCommonVerbs(app, "crud/crudCommon", baseController);
        registerCommonVerbs(app, "crud/crudGridSimple", genericViewController);
        registerCommonVerbs(app, "crud/crudGridSearch", genericViewController);
        registerCommonVerbs(app, "crud/crudGridSearchDirect", genericViewController);
        registerCommonVerbs(app, "crud/crudGridPagination", genericViewController);
        registerCommonVerbs(app, "crud/crudGridPaginationLazyLoading", genericViewController);
        registerCommonVerbs(app, "crud/crudExpand", genericViewController);
        registerCommonVerbs(app, "crud/crudExpandCustomSize", genericViewController);
        registerCommonVerbs(app, "crud/crudFormSimple", genericViewController);
        registerCommonVerbs(app, "crud/crudFormExtended", genericViewController);
        registerCommonVerbs(app, "crud/crudGridEmptyMessage", genericViewController);




        registerCommonVerbs(app, "helpdesk/talks/common/fakes", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/common/loadData", helpdeskViewLoadDataController);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/common", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/home", helpdeskViewHomeController, helpdeskIsAuthenticated, false);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/auth", helpdeskViewAuthController, undefined, false);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/unauthorize", helpdeskViewUnAuthController);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/wiki", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/history", genericViewController, helpdeskIsAuthenticated);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/message", helpdeskViewMessageController, helpdeskIsAuthenticated);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/subject", genericViewController, helpdeskIsAuthenticated);

    };

})(module);