(function (module) {

    "use strict";


    var config = require('../libs/config');
    var pkg = require('../../../package.json');
    var i18n = require('i18n-2');
    var util = require('../libs/commonFunctions');
    var utilsNode = require('util');
    var DataResult = require('../models/dataResult');

    //var glob = require('globalize');
    //var globCultures = require('globalize/lib/cultures/globalize.cultures');




    //function modelForLayoutGet(req) {


    //    var i18n = req.i18n;

    //    var m = {
    //        Title: "Azure nodejs application template",
    //        DomainName: config.get('domainName'),
    //        Package: pkg,
    //        IsTest: (process.env.NODE_ENV === 'test'),
    //        Globalization: {
    //            cultureSelected: i18n.locale,
    //            cultureGlobalization: i18n.locale,
    //            cultureDatePicker: i18n.locale,
    //        },
    //        // Indica si la pagina viene de una peticion del menu o viene de una peticion para SEO
    //        IsFirstRequest: (req.query.firstRequest === undefined),
    //        //Breadcrumb: [
    //        //{ title: i18n.__("GeneralTexts.BreadcrumbNavigation") },
    //        //{ title: i18n.__("GeneralTexts.Home"), url: "/" }
    //        //],
    //        CssFiles: [
    //            //"/public/views/home/home.css",
    //        ],
    //        JsFiles: [
    //            //"/public/views/home/home.js",
    //        ],
    //    };


    //    if (m.IsFirstRequest) {
    //        //m.JsFiles.push("/public/views/home/firstRequest.js");
    //    }

    //    return m;
    //}



    //module.exports.setRoutes = function (app, log) {

    //    app.get('/tests*', function (req, res, next) {
    //        //res.sendFile('index.html', {

    //        console.log(req.params[0]);

    //        res.sendFile('test/qunit/' + req.params[0], {
    //            root: app.get('root')
    //        });
    //    });

    //    app.get('/', function (req, res, next) {

    //        var m = modelForLayoutGet(req);

    //        if (m.IsFirstRequest) {
    //            res.render('home/home.handlebars', m);
    //        }
    //        else {
    //            res.sendFile('home/home.handlebars', {
    //                root: app.get('views')
    //            });
    //        }


    //    });

    //    app.get('/uicontrols/*/*', function (req, res, next) {

    //        if (req.params[1] === '') {
    //            //browser requesting a page
    //            var m = modelForLayoutGet(req);

    //            //get template json config -> jsFiles, CssFiles, controllerInterface, etc
    //            var templateContextPath = utilsNode.format(app.get('views') + '/%s/index.handlebars.json', req.params[0]);

    //            //extend common layout model with template config
    //            m = util.extend(m, require(templateContextPath));

    //            //do render
    //            if (m.IsFirstRequest) {
    //                //render SEO friendly layout + template
    //                res.render(req.params[0] + '/index.handlebars', m);
    //            }
    //            else {
    //                //return template and let frontend engine render results
    //                res.sendFile(req.params[0] + '/index.handlebars', {
    //                    root: app.get('views')
    //                });
    //            }
    //        }
    //        else {
    //            // browser requesting a resource -> *.js, *.png, *.css
    //            var pathName = req._parsedUrl.pathname.replace('/uicontrols', '');
    //            res.sendFile(pathName, {
    //                root: app.get('views')
    //            });

    //        }
    //    });



    //};

})(module);