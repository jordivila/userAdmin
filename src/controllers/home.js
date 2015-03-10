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

        app.get('/', function (req, res, next) {
            res.sendFile('index.html', {
                root: app.get('views')
            });
        });

        app.get('/home', function (req, res, next) {

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

        app.post('/home', function (req, res, next) {

            var i18n = req.i18n;

            /*
            glob.culture("es-CA");
            console.log(glob.parseFloat("1,234.56"));
            console.log(glob.parseFloat("12,34"));
            console.log(glob.parseFloat("12.34"));
            console.log(parseFloat("12.34"));
            */


            //console.log(glob.format(3899.888, "c"));

            //console.log(isNaN(glob.parseFloat("1.234,56")));

            var cloned = util.extend(req.body, {});
            var isValid = false;

            for (var i = 0; i < cloned.length; i++) {
                cloned[i].errors = [
                    "esto es un error descriptivo ;)",
                ];
            }


            var result = new DataResult(isValid, "Existen errores en el formulario", cloned);



            //jQuery('div.sample').append('<span>' + Globalize.format(3899.888, "c") + '</span><br/>');
            //jQuery('div.sample').append('<span>' + Globalize.format(new Date(2011, 12, 25), "D") + '</span><br/>');
            //jQuery('div.sample').append('<span>' + Globalize.format(45678, "n0") + '</span><br/>');

            res.send(result);
            res.end();
        });


    };

})(module);