(function (module) {


    "use strict";

    var usersController = require('../controllers/users');
    var bodyParser = require('body-parser');

    var bodyParserText = bodyParser.text();


    module.exports.setRoutes = function (app, log, authController) {


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
                        url: "/home/",
                        text: i18n.__("GeneralTexts.Home")
                    },
                    {
                        url: "/user/logon/",
                        text: i18n.__("AccountResources.LogOn"),
                    },
                    {
                        url: "/about/",
                        text: i18n.__("GeneralTexts.About")
                    },
                    {
                        text: i18n.__("GeneralTexts.Settings"),
                        childs: [
                                {
                                    url: "/languages/",
                                    text: i18n.__("GeneralTexts.Languages")
                                },
                                {
                                    url: "/themes/",
                                    text: i18n.__("GeneralTexts.SiteThemes")
                                },
                                {
                                    url: "/currencies/",
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
                                        url: "/globalize/serverside/",
                                        text: "Server side"
                                    },
                                    {
                                        url: "/globalize/clientside/",
                                        text: "Client side"
                                    },
                                ]
                            },
                            {
                                text: "UI Controls",
                                childs: [
                                    {
                                        text: "Menu",
                                        childs: [
                                            {
                                                url: "/menu/menuTree/",
                                                text: "Menu Tree"
                                            },
                                            {
                                                url: "/menu/menuSlides/",
                                                text: "Menu Slides"
                                            },
                                        ]
                                    },
                                    {
                                        text: "Grid widget",
                                        childs: [
                                            {
                                                url: "/crud/crudGridSimple/",
                                                text: "Basic Grid"
                                            },
                                            {
                                                url: "/crud/crudGridSearch/",
                                                text: "Search & paginate"
                                            },
                                            {
                                                url: "/crud/crudGridSearchDirect/",
                                                text: "Search filter on top"
                                            },
                                            {
                                                url: "/crud/crudGridPagination/",
                                                text: "Pagination config"
                                            },
                                            {
                                                url: "/crud/crudScrollable/",
                                                text: "Scrollable"
                                            },
                                            {
                                                url: "/crud/crudExpand/",
                                                text: "Expand grid & resize"
                                            },
                                        ],
                                    },
                                    {
                                        text: "Crud widget",
                                        childs: [
                                            {
                                                url: "/crud/crudFormSimple/",
                                                text: "CRUD Simple form"
                                            },
                                            {
                                                url: "/crud/crudFormExtended/",
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


    };

})(module);