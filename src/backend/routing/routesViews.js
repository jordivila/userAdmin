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

    var HelpdeskViewBaseController = require('../controllers/' + config.get('helpdesk:controllerType')).HelpdeskViewBaseController;
    var HelpdeskViewHomeController = require('../controllers/' + config.get('helpdesk:controllerType')).HelpdeskViewHomeController;
    var HelpdeskViewAuthController = require('../controllers/' + config.get('helpdesk:controllerType')).HelpdeskViewAuthController;
    var HelpdeskViewMessageController = require('../controllers/' + config.get('helpdesk:controllerType')).HelpdeskViewMessageController;

    var languagesController = new LanguagesController();
    var currenciesController = new CurrenciesController();
    var homeController = new HomeController();
    var themesController = new ThemesController();
    var globalizeController = new GlobalizeController();
    var baseController = new BaseController();
    var genericViewController = new GenericViewController();

    var helpdeskViewBaseController = new HelpdeskViewBaseController();
    var helpdeskViewHomeController = new HelpdeskViewHomeController();
    var helpdeskViewAuthController = new HelpdeskViewAuthController();
    var helpdeskViewMessageController = new HelpdeskViewMessageController();

    function registerCommonVerbs(app, route, controller, passportIsAuthFunc) {

        // set up the middleware
        app.use('/' + route + '/*', function (req, res, next) {

            baseController.setViewModelBase(req);

            next();
        });


        var getViewContentActions = [];

        if (passportIsAuthFunc) { getViewContentActions.push(passportIsAuthFunc); }

        getViewContentActions.push(function (req, res, next) {

            var reqType = controller.getRequestType(req);

            if (reqType.isView || reqType.isViewModel) {

                controller.setViewInfo(app, req, route);

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
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/common", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/home", helpdeskViewHomeController, helpdeskViewBaseController.isAuthenticated);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/auth", helpdeskViewAuthController);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/unauthorize", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/wiki", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/history", genericViewController, helpdeskViewBaseController.isAuthenticated);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/message", helpdeskViewMessageController, helpdeskViewBaseController.isAuthenticated);
        registerCommonVerbs(app, "helpdesk/talks/:apiEndpointType(customer|employee)/subject", genericViewController, helpdeskViewBaseController.isAuthenticated);


        //registerCommonVerbs(app, "helpdesk/talks/employee/common", genericViewController);
        //registerCommonVerbs(app, "helpdesk/talks/employee/home", helpdeskViewHomeController, helpdeskViewBaseController.isAuthenticated);
        //registerCommonVerbs(app, "helpdesk/talks/employee/auth", helpdeskViewAuthController);
        //registerCommonVerbs(app, "helpdesk/talks/employee/unauthorize", genericViewController);
        //registerCommonVerbs(app, "helpdesk/talks/employee/wiki", genericViewController);
        //registerCommonVerbs(app, "helpdesk/talks/employee/history", genericViewController, helpdeskViewBaseController.isAuthenticated);
        //registerCommonVerbs(app, "helpdesk/talks/employee/message", helpdeskViewMessageController, helpdeskViewBaseController.isAuthenticated);
        //registerCommonVerbs(app, "helpdesk/talks/employee/subject", genericViewController, helpdeskViewBaseController.isAuthenticated);


        //registerCommonVerbs(app, "helpdesk/talks/customer/common", genericViewController);
        //registerCommonVerbs(app, "helpdesk/talks/customer/home", helpdeskViewHomeController, helpdeskViewBaseController.isAuthenticated);
        //registerCommonVerbs(app, "helpdesk/talks/customer/auth", helpdeskViewAuthController);
        //registerCommonVerbs(app, "helpdesk/talks/customer/unauthorize", genericViewController);
        //registerCommonVerbs(app, "helpdesk/talks/customer/wiki", genericViewController);
        //registerCommonVerbs(app, "helpdesk/talks/customer/history", genericViewController, helpdeskViewBaseController.isAuthenticated);
        //registerCommonVerbs(app, "helpdesk/talks/customer/message", helpdeskViewMessageController, helpdeskViewBaseController.isAuthenticated);
        //registerCommonVerbs(app, "helpdesk/talks/customer/subject", genericViewController, helpdeskViewBaseController.isAuthenticated);
        

    };

})(module);