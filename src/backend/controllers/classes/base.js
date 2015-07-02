(function (module) {

    "use strict";

    module.exports = Base;

    var config = require('../../libs/config');
    var pkg = require('../../../../package.json');
    var i18n = require('i18n-2');


    function Base() {

    }

    Base.prototype.setViewModelBase = function (req) {

        var m = {
            Title: '',
            domainName: config.get('domainInfo:domainName'),
            "package": {
                name: pkg.name,
                version: pkg.version
            },
            isTest: config.get('IsTestEnv'),
            theme: req.cookies[config.get('clientApp:themes:cookieName')] ? req.cookies[config.get('clientApp:themes:cookieName')] : config.get('clientApp:themes:default'),
            globalization: {
                cultureGlobalization: req.i18n.locale,
                cultureDatePicker: req.i18n.locale,
            },
            // Indica si la pagina viene de una peticion del menu o viene de una peticion para SEO
            isSEORequest: (req.query.seoRequest === undefined),
            //Breadcrumb: [
            //{ title: i18n.__("GeneralTexts.BreadcrumbNavigation") },
            //{ title: i18n.__("GeneralTexts.Home"), url: "/" }
            //],
            cssFiles: [
                //"/public/views/home/home.css",
            ],
            //jsFiles: [
                //"/public/views/home/home.js",
            //],
        };

        req.viewModel = m;

    };

    Base.prototype.setCookie = function (res, name, value) {
        res.cookie(name, value, { expires: new Date(Date.now() + 900000), httpOnly: true });
    };

    Base.prototype.setCookieClientAccess = function (res, name, value) {
        // WARNING !! httpOnly->false
        res.cookie(name, value, { expires: new Date(Date.now() + 900000), httpOnly: false });
    };



})(module);