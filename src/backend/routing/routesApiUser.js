(function (module) {


    "use strict";

    var usersController = require('../controllers/users');
    var bodyParser = require('body-parser');
    var bodyParserText = bodyParser.text();
    var crossLayerConfig = require('../../crossLayer/config');
    var config = require('../libs/config');
    var virtualDirectory = config.get('domainInfo:virtualDirectory');
    var HelpdeskController = require('../controllers/' + config.get('helpdesk:controllerType')).HelpdeskAPIController;
    var helpdeskController = new HelpdeskController();


    module.exports.setRoutes = function (app, log, authController) {


        app.get('/api/user', [
            authController.isAuthenticated,
            function (req, res, next) {

                usersController.getById(req.user.userId, function (err, userInfo) {
                    if (err) return next(err);

                    res.json({
                        email: userInfo ? userInfo.email : null
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
                        url: "/" + virtualDirectory + "home/",
                        text: i18n.__("GeneralTexts.Home")
                    },
                    {
                        url: "/" + virtualDirectory + "user/logon/",
                        text: i18n.__("AccountResources.LogOn"),
                    },
                    {
                        text: i18n.__("Helpdesk.Talks.MenuTitle"),
                        childs: [
                                {
                                    url: "/" + virtualDirectory + "helpdesk/talks/customer/home/",
                                    text: "Customer"
                                },
                                {
                                    url: "/" + virtualDirectory + "helpdesk/talks/customer/wiki/",
                                    text: "Customer wiki"
                                },
                                {
                                    url: "/" + virtualDirectory + "helpdesk/talks/employee/home/",
                                    text: "Employee"
                                },
                                {
                                    url: "/" + virtualDirectory + "helpdesk/talks/employee/wiki/",
                                    text: "Employee wiki"
                                }
                        ]
                    },
                    //{
                    //    url: "/about/",
                    //    text: i18n.__("GeneralTexts.About")
                    //},
                    {
                        text: i18n.__("GeneralTexts.Settings"),
                        childs: [
                                {
                                    url: "/" + virtualDirectory + "languages/",
                                    text: i18n.__("GeneralTexts.Languages")
                                },
                                {
                                    url: "/" + virtualDirectory + "themes/",
                                    text: i18n.__("GeneralTexts.SiteThemes")
                                },
                                {
                                    url: "/" + virtualDirectory + "currencies/",
                                    text: i18n.__("GeneralTexts.Currencies")
                                },
                        ]
                    },
                    {
                        text: "Dev samples",
                        childs: [
                            {
                                //url: "/globalize/",
                                text: "Globalize",
                                childs: [
                                    {
                                        url: "/" + virtualDirectory + "globalize/serverside/",
                                        text: "Server side"
                                    },
                                    {
                                        url: "/" + virtualDirectory + "globalize/clientside/",
                                        text: "Client side"
                                    },
                                ]
                            },
                            {
                                text: "UI Controls",
                                childs: [
                                    {
                                        text: "Breadrumb",
                                        childs: [
                                            {
                                                url: "/" + virtualDirectory + "breadcrumb/singleItem/",
                                                text: "Single item"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "breadcrumb/multipleItems/",
                                                text: "Multiple items"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "breadcrumb/clientSideBuild/",
                                                text: "Client side built"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "breadcrumb/clientSideFunction/",
                                                text: "Client side function"
                                            },
                                        ]
                                    },
                                    {
                                        text: "Menu",
                                        childs: [
                                            {
                                                url: "/" + virtualDirectory + "menu/menuTree/",
                                                text: "Menu Tree"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "menu/menuSlides/",
                                                text: "Menu Slides"
                                            },
                                        ]
                                    },
                                    {
                                        text: "Grid widget",
                                        childs: [
                                            {
                                                url: "/" + virtualDirectory + "crud/crudGridSimple/",
                                                text: "Basic Grid"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "crud/crudGridEmptyMessage/",
                                                text: "Custom emtpy message"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "crud/crudGridSearch/",
                                                text: "Search & paginate"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "crud/crudGridSearchDirect/",
                                                text: "Search filter on top"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "crud/crudGridPagination/",
                                                text: "Pagination config"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "crud/crudGridPaginationLazyLoading/",
                                                text: "Lazy loading pagination"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "crud/crudExpand/",
                                                text: "Expand grid & resize"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "crud/crudExpandCustomSize/",
                                                text: "Expand + custom size"
                                            },

                                        ],
                                    },
                                    {
                                        text: "Crud widget",
                                        childs: [
                                            {
                                                url: "/" + virtualDirectory + "crud/crudFormSimple/",
                                                text: "CRUD Simple form"
                                            },
                                            {
                                                url: "/" + virtualDirectory + "crud/crudFormExtended/",
                                                text: "CRUD Extended"
                                            },
                                        ],
                                    },
                                ]
                            },
                        ]
                    },
                ]);

                res.end();
            }
        ]);


        app.post('/api/log/clienterror', bodyParserText, function (req, res, next) {

            console.error(req.body);

        });







        app.post('/api/helpdesk/:apiEndpointType(customer|employee)/talk/search', [
            helpdeskController.isAuthenticated,
            function (req, res, next) {
                helpdeskController.talkSearch(req, req.body, function (err, dateResult) {
                    if (err) return next(err);

                    res.json(dateResult);
                });
            }]);
        app.post('/api/helpdesk/:apiEndpointType(customer|employee)/talk/add', [
            helpdeskController.isAuthenticated,
            function (req, res, next) {
                helpdeskController.talkAdd(req, req.body, function (err, dateResult) {
                    if (err) return next(err);

                    res.json(dateResult);
                });
            }]
        );
        app.post('/api/helpdesk/:apiEndpointType(customer|employee)/message/add', [
            helpdeskController.isAuthenticated,
            function (req, res, next) {
                helpdeskController.messageAdd(req, req.body, function (err, dateResult) {
                    if (err) return next(err);

                    res.json(dateResult);
                });
            }]
        );
        app.post('/api/helpdesk/:apiEndpointType(customer|employee)/message/getAll', [
            helpdeskController.isAuthenticated,
            function (req, res, next) {
                helpdeskController.messageGetAll(req, req.body, function (err, dateResult) {
                    if (err) return next(err);

                    res.json(dateResult);
                });
            }]
        );
        app.post('/api/helpdesk/:apiEndpointType(customer|employee)/message/getUnread', [
            helpdeskController.isAuthenticated,
            function (req, res, next) {
                helpdeskController.messageGetUnread(req, req.body, function (err, dateResult) {
                    if (err) return next(err);

                    res.json(dateResult);
                });
            }]
        );
        // api routes just for employees
        app.post('/api/helpdesk/:apiEndpointType(employee)/talk/getById', [
            helpdeskController.isAuthenticated,
            function (req, res, next) {
                helpdeskController.talkGetById(req, req.body, function (err, dateResult) {
                    if (err) return next(err);

                    res.json(dateResult);
                });
            }]
        );
        app.post('/api/helpdesk/:apiEndpointType(employee)/talk/savedByEmployee', [
            helpdeskController.isAuthenticated,
            function (req, res, next) {
                helpdeskController.talkSavedByEmployee(req, req.body, function (err, dateResult) {
                    if (err) return next(err);

                    res.json(dateResult);
                });
            }]
        );
        app.post('/api/helpdesk/:apiEndpointType(employee)/customer/search', [
            helpdeskController.isAuthenticated,
            function (req, res, next) {
                helpdeskController.customerSearch(req, req.body, function (err, dateResult) {
                    if (err) return next(err);

                    res.json(dateResult);
                });
            }]
        );
        app.post('/api/helpdesk/:apiEndpointType(employee)/employee/search', [
            helpdeskController.isAuthenticated,
            function (req, res, next) {
                helpdeskController.employeeSearch(req, req.body, function (err, dateResult) {
                    if (err) return next(err);

                    res.json(dateResult);
                });
            }]
        );





    };

})(module);