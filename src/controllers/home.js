(function (module) {

    "use strict";


    var config = require('../libs/config');
    var pkg = require('../../package.json');
    var i18n = require('i18n-2');
    var util = require('../libs/commonFunctions');
    var DataResult = require('../models/dataResult');

    //var glob = require('globalize');
    //var globCultures = require('globalize/lib/cultures/globalize.cultures');

    module.exports.setRoutes = function (app, log) {

        app.get('/tests', function (req, res, next) {
            res.sendFile('index.html', {
                root: app.get('views')
            });
        });

        app.get('/', function (req, res, next) {

            var i18n = req.i18n;

            //console.log(req.i18n);

            res.render('home/home', {
                Title: "Azure nodejs application template",
                DomainName: config.get('domainName'),
                Package: pkg,
                IsTest: (process.env.NODE_ENV === 'test'),
                Globalization: {
                    cultureSelected: i18n.locale,
                    cultureGlobalization: i18n.locale,
                    cultureDatePicker: i18n.locale,
                },
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

            });
        });

        app.get('/template*', function (req, res, next) {
            var pathName = req.params[0];
            res.sendFile(pathName, {
                root: app.get('root')
            });
        });
        
    };

})(module);