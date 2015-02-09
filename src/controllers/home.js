(function(module) {

    "use strict";
    

    var config = require('../libs/config');
    var pkg = require('../../package.json');
    var i18n = require('i18n-2');

    module.exports.setRoutes = function(app, log) {

        app.get('/', function(req, res, next) {
            res.sendFile('index.html', {
                root: app.get('views')
            });
        });

        app.get('/home', function (req, res, next) {

            var i18n = req.i18n;

            res.render('home/home', {
                Title: "Azure nodejs application template",
                DomainName: config.get('domainName'),
                Package: pkg,
                IsTest: (process.env.NODE_ENV === 'test'),
                Breadcrumb: [
                    { title: i18n.__("GeneralTexts.BreadcrumbNavigation") },
                    { title: i18n.__("GeneralTexts.Home"), url: "/" }
                ],
                CssFiles: ["/public/views/home/home.css"],
                JsFiles: ["/public/views/home/home.js"]
            });
        });

    };

})(module);