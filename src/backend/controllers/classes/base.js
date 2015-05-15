﻿(function (module) {

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
            DomainName: config.get('domainInfo:domainName'),
            Package: {
                name: pkg.name,
                version: pkg.version
            },
            IsTest: config.get('IsTestEnv'),
            Theme: req.cookies[config.get('themes:cookieName')] ? req.cookies[config.get('themes:cookieName')] : config.get('themes:default'),
            Globalization: {
                cultureSelected: req.i18n.locale,
                cultureGlobalization: req.i18n.locale,
                cultureDatePicker: req.i18n.locale,
            },
            // Indica si la pagina viene de una peticion del menu o viene de una peticion para SEO
            IsSEORequest: (req.query.seoRequest === undefined),
            //Breadcrumb: [
            //{ title: i18n.__("GeneralTexts.BreadcrumbNavigation") },
            //{ title: i18n.__("GeneralTexts.Home"), url: "/" }
            //],
            CssFiles: [
                //"/public/views/home/home.css",
            ],
            JsFiles: [
                //"/public/views/home/home.js",
            ],
        };

        req.viewModel = m;

    };
    Base.prototype.setCookie = function (res, name, value) {
        res.cookie(name, value, { expires: new Date(Date.now() + 900000), httpOnly: true });
    };

})(module);