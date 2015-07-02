(function (module) {

    "use strict";

    module.exports = CurrencyController;

    var config = require('../libs/config');
    var PreferenceSetter = require('./classes/preferenceSetter.js');
    var GlobalizeController = require("./globalize");
    var util = require('util');

    function CurrencyController() {
        PreferenceSetter.apply(this, arguments);
    }
    CurrencyController.prototype = new PreferenceSetter();
    CurrencyController.prototype.getAll = function (req, cb) {


        var availableCurs = config.get('clientApp:money:currencies');
        var cldrDataGet = function (currencyId) {

            var displayName = GlobalizeController.CldrData.main[req.i18n.locale].numbers.currencies[currencyId].displayName;
            var symbol = GlobalizeController.CldrData.main[req.i18n.locale].numbers.currencies[currencyId].symbol;

            // Capitalize
            displayName = displayName.charAt(0).toUpperCase() + displayName.substring(1);

            return {
                id: currencyId,
                name: util.format('%s (%s)',
                                displayName,
                                symbol)
            };
        };

        
        this.data = [];

        for (var i = 0; i < availableCurs.length; i++) {
            this.data.push(cldrDataGet(availableCurs[i]));
            this.data[i].selected = this.data[i].id == this.cookieValueGet(req);
        }

        cb(null, this.data);

    };
    CurrencyController.prototype.initRequest = function (req, res) {

        if (config.get('clientApp:money:currencies').indexOf(this.cookieValueGet(req)) > -1) {
            PreferenceSetter.prototype.initRequest.call(this, req, res);
        }
        else {
            PreferenceSetter.prototype.overrideRequest.call(this, this.defaultValueGet(), req, res);
        }

    };
    CurrencyController.prototype.cookieName = config.get('clientApp:money:cookieName');
    CurrencyController.prototype.cookieValueGet = function (req) {
        if (req.cookies[this.cookieName]) {
            return req.cookies[this.cookieName];
        }
        else {
            return this.defaultValueGet();
        }
    };
    CurrencyController.prototype.defaultValueGet = function (req) {
        return config.get('clientApp:money:default');
    };


})(module);
