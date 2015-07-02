(function (module) {

    "use strict";

    module.exports = GlobalizeController;

    //var markdown = require("markdown").markdown;
    var GenericViewController = require('./classes/genericView');
    var Globalize = require("globalize");
    var config = require("../libs/config");
    var path = require('path');
    var fs = require('fs');
    var utilExtensions = require('../libs/commonFunctions');


    function GlobalizeController() {
        GenericViewController.apply(this, arguments);
    }
    GlobalizeController.prototype = new GenericViewController();
    GlobalizeController.CldrData = null;
    GlobalizeController.Messages = null;
    GlobalizeController.prototype.initCldrData = function (cb) {

        var locales = config.get("i18n:locales");
        var localesExtension = config.get("i18n:extension");
        var localesPath = path.join(__dirname, "/../../../", config.get("i18n:directory"));
        var localesMessages = {};

        var globCldrData = {};
        utilExtensions.extendDeep(globCldrData, require("cldr-data/supplemental/currencyData"));
        utilExtensions.extendDeep(globCldrData, require("cldr-data/supplemental/likelySubtags"));
        utilExtensions.extendDeep(globCldrData, require("cldr-data/supplemental/plurals"));
        utilExtensions.extendDeep(globCldrData, require("cldr-data/supplemental/timeData"));
        utilExtensions.extendDeep(globCldrData, require("cldr-data/supplemental/weekData"));

        for (var i = 0; i < locales.length; i++) {

            utilExtensions.extendDeep(globCldrData, require("cldr-data/main/" + locales[i] + "/ca-gregorian"));
            utilExtensions.extendDeep(globCldrData, require("cldr-data/main/" + locales[i] + "/currencies"));
            utilExtensions.extendDeep(globCldrData, require("cldr-data/main/" + locales[i] + "/dateFields"));
            utilExtensions.extendDeep(globCldrData, require("cldr-data/main/" + locales[i] + "/numbers"));

            localesMessages[locales[i]] = require(path.join(localesPath, locales[i] + localesExtension));
        }

        GlobalizeController.CldrData = globCldrData;
        GlobalizeController.Messages = localesMessages;

        Globalize.load(GlobalizeController.CldrData);
        Globalize.loadMessages(GlobalizeController.Messages);

        cb();
    };
    GlobalizeController.prototype.viewIndexModel = function (req, cb) {


        var like;
        var currentCulture = req.viewModel.globalization.cultureGlobalization;


        Globalize.locale(currentCulture);

        var globInstance = new Globalize(Globalize.cldr);

        like = globInstance.messageFormatter("Views.Globalize.Like");

        cb(null, {
            TheDate: globInstance.formatDate(new Date(), { datetime: "medium" }),
            TheNumber: globInstance.formatNumber(12345.6789),
            TheCurrency: globInstance.formatCurrency(69900, "USD"),
            ThePlural: globInstance.plural(12345.6789),
            TheTimeAgo: globInstance.formatRelativeTime(-35, "second"),
            TheMessages: [like(0), like(1), like(2), like(3)]
        });
    };

})(module);