(function (module) {

    "use strict";

    var LanguagesController = require('../controllers/languages');
    var CurrenciesController = require('../controllers/currencies');
    var HomeController = require('../controllers/home');
    var ThemesController = require('../controllers/themes');
    var GlobalizeController = require('../controllers/globalize');
    var BaseController = require('../controllers/classes/base');
    var GenericViewController = require('../controllers/classes/genericView');
    var HelpdeskViewHomeController = require('../controllers/helpdeskViewHome');

    var languagesController = new LanguagesController();
    var currenciesController = new CurrenciesController();
    var homeController = new HomeController();
    var themesController = new ThemesController();
    var globalizeController = new GlobalizeController();
    var baseController = new BaseController();
    var genericViewController = new GenericViewController();
    var helpdeskViewHomeController = new HelpdeskViewHomeController();

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
        registerCommonVerbs(app, "helpdesk/talks/employee/common", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/employee/home", helpdeskViewHomeController);
        registerCommonVerbs(app, "helpdesk/talks/employee/wiki", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/employee/history", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/employee/message", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/employee/subject", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/customer/home", helpdeskViewHomeController);
        registerCommonVerbs(app, "helpdesk/talks/customer/wiki", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/customer/common", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/customer/history", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/customer/subject", genericViewController);
        registerCommonVerbs(app, "helpdesk/talks/customer/message", genericViewController);
        
        
        
        
        
        
        
    };

})(module);