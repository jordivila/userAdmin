(function (module) {

    "use strict";


    var config = require('../libs/config');
    var pkg = require('../../package.json');
    var i18n = require('i18n-2');
    var util = require('../libs/commonFunctions');
    var utilsNode = require('util');
    var DataResult = require('../models/dataResult');

    //var glob = require('globalize');
    //var globCultures = require('globalize/lib/cultures/globalize.cultures');




    function modelForLayoutGet(req) {

        var i18n = req.i18n;
        var m = {
            Title: "Azure nodejs application template",
            DomainName: config.get('domainName'),
            Package: pkg,
            IsTest: (process.env.NODE_ENV === 'test'),
            Globalization: {
                cultureSelected: i18n.locale,
                cultureGlobalization: i18n.locale,
                cultureDatePicker: i18n.locale,
            },
            // Indica si la pagina viene de una peticion del menu o viene de una peticion para SEO
            IsFirstRequest: (req.query.firstRequest === undefined),
            //Breadcrumb: [
            //{ title: i18n.__("GeneralTexts.BreadcrumbNavigation") },
            //{ title: i18n.__("GeneralTexts.Home"), url: "/" }
            //],
            CssFiles: [
                //"/public/views/home/home.css",
                //"/public/views/home/cir.css",
            ],
            JsFiles: [
                //"/public/views/home/home.js",
                //"/public/views/home/cir.widget.cirDataEntry.js",
                //"/public/views/home/cir.widget.crudCustomer.js",
                //"/public/views/home/cir.widget.crudProduct.js",
            ],
        };

        if (m.IsFirstRequest) {
            //m.JsFiles.push("/public/views/home/firstRequest.js");
        }

        return m;
    }



    module.exports.setRoutes = function (app, log) {

        app.get('/tests', function (req, res, next) {
            res.sendFile('index.html', {
                root: app.get('views')
            });
        });

        app.get('/', function (req, res, next) {

            var m = modelForLayoutGet(req);

            if (m.IsFirstRequest) {
                res.render('home/home.handlebars', m);
            }
            else {
                res.sendFile('home/home.handlebars', {
                    root: app.get('views')
                });
            }


        });

        app.get('/uicontrols/*/*', function (req, res, next) {

            //console.log(req);

            if (req.params[1] === '') {

                //browser requesting a page

                var m = modelForLayoutGet(req);
                var templateContextPath = utilsNode.format('../public/views/%s/index.handlebars.json', req.params[0]);

                m = util.extend(m, require(templateContextPath));

                


                //if (req.params[0] == 'themes') {
                //    m = util.extend(m, require('../public/views/themes/index.handlebars.json'));
                //}

                //console.log(m);

                if (m.IsFirstRequest) {
                    res.render(req.params[0] + '/index.handlebars', m);
                }
                else {
                    res.sendFile(req.params[0] + '/index.handlebars', {
                        root: app.get('views')
                    });
                }
            }
            else {

                // browser requesting a resource

                var pathName = req._parsedUrl.pathname.replace('/uicontrols', '');
                res.sendFile(pathName, {
                    root: app.get('views')
                });

            }
        });

        //app.get('/public/views/*.html', function (req, res, next) {
        //    res.render('home/firstRequest', modelForLayoutGet(req));
        //});

        //app.get('/public/views/*', function (req, res, next) {
        //    res.sendFile(req._parsedUrl.pathname, {
        //        root: app.get('root')
        //    });
        //});

        app.get('/template*', function (req, res, next) {
            var pathName = req.params[0];
            res.sendFile(pathName, {
                root: app.get('root')
            });
        });

    };

})(module);