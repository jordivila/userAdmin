(function (module) {

    "use strict";

    module.exports.initRequestLanguage = initRequestLanguage;
    module.exports.index = index;
    module.exports.indexJSON = indexJSON;
    module.exports.update = update;

    var config = require('../libs/config');
    var PreferenceSetter = require('./classes/preferenceSetter.js');


    function LangController() {
        PreferenceSetter.apply(this, Array.prototype.slice.call(arguments));
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

        cb(null, this.data);

    };
    LangController.prototype.initRequest = function (req, res) {
        req.i18n.setLocaleFromCookie();
        PreferenceSetter.prototype.initRequest.call(this, req, res);
    };

    var langController = new LangController(config.get('i18n:cookieName'), config.get('i18n:locales')[0]);

    function initRequestLanguage(req, res) {
        langController.initRequest(req, res);
    }

    function index(app, req, res, next) {
        langController.viewIndex(app, req, res, next);
    }

    function indexJSON(app, req, res, next) {
        langController.viewIndexJson(app, req, res, next);
    }


    function update(req, res, next) {
        langController.update(req, res, next);
    }

})(module);