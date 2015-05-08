(function (module) {

    "use strict";

    module.exports.initRequestLanguage = initRequestLanguage;
    module.exports.viewIndex = viewIndex;
    module.exports.viewIndexJson = viewIndexJson;
    module.exports.update = update;

    var config = require('../libs/config');
    var PreferenceSetter = require('./classes/preferenceSetter.js');


    function LangController() {
        PreferenceSetter.apply(this, {});
    }
    LangController.prototype = new PreferenceSetter();
    LangController.prototype.getAll = function (req, cb) {

        this.data = [
                {
                    id: "es",
                    name: req.i18n.__("GeneralTexts.Language.Spanish")
                },
                {
                    id: "cat",
                    name: req.i18n.__("GeneralTexts.Language.Catalan")
                },
                {
                    id: "en",
                    name: req.i18n.__("GeneralTexts.Language.English")
                }];

        for (var i = 0; i < this.data.length; i++) {
            this.data[i].selected = this.data[i].id == this.cookieValueGet(req);
        }

        cb(null, this.data);

    };
    LangController.prototype.initRequest = function (req, res) {
        req.i18n.setLocaleFromCookie();
        PreferenceSetter.prototype.initRequest.call(this, req, res);
    };
    LangController.prototype.cookieName = config.get('i18n:cookieName');
    LangController.prototype.cookieValueGet = function (req) {
        if (req.cookies[this.cookieName]) {
            return req.cookies[this.cookieName];
        }
        else {
            return config.get('i18n:locales')[0];
        }
    };

    var langController = new LangController();

    function initRequestLanguage(req, res) {
        langController.initRequest(req, res);
    }

    function viewIndex(app, req, res, next) {
        langController.viewIndex(app, req, res, next);
    }

    function viewIndexJson(app, req, res, next) {
        langController.viewIndexJson(app, req, res, next);
    }

    function update(req, res, next) {
        langController.update(req, res, next);
    }

})(module);