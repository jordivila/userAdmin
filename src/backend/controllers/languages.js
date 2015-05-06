(function (module) {

    "use strict";

    module.exports.initRequestLanguage = initRequestLanguage;
    module.exports.index = index;
    module.exports.indexJSON = indexJSON;
    module.exports.getLanguages = getLanguages;
    module.exports.update = update;

    var config = require('../libs/config');
    var pkg = require('../../../package.json');
    var i18n = require('i18n-2');
    var util = require('../libs/commonFunctions');
    var utilsNode = require('util');
    var DataResultModel = require('../models/dataResult');
    var ErrorHandled = require('../models/errorHandled.js');
    var commonController = require('../controllers/common');
    var usersController = require('../controllers/users');



    function initRequestLanguage(req, res) {

        req.i18n.setLocaleFromCookie();

        if (req.cookies[config.get('i18n:cookieName')]) {

        }
        else {
            commonController.setCookie(res, config.get('i18n:cookieName'), req.i18n.getLocale());
        }
    }

    function getLanguages(req, cb) {

        

        var viewModel = {
            LangsAvailable: [
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
                }]
        };

        cb(null, viewModel);
    }


    function index(app, req, res, next) {

        var tplInfo = commonController.getViewModel(app, req, 'languages');

        if (tplInfo.viewModel.IsSEORequest) {

            getLanguages(req, function (err, result) {
                if (err) {
                    return next(err);
                }

                res.render(tplInfo.viewPath, util.extend(tplInfo.viewModel, result));
            });
        }
        else {
            res.sendFile(tplInfo.viewPath, {
                root: app.get('views')
            });
        }
    }

    function indexJSON(app, req, res, next) {

        var tplInfo = commonController.getViewModel(app, req, 'languages');

        getLanguages(req, function (err, result) {

            if (err) {
                return next(err);
            }

            res.json(util.extend(tplInfo.viewModel, result));
        });
    }

    function update(req, res, next) {

        commonController.setCookie(res, config.get('i18n:cookieName'), req.body.localeNewValue);

        res.json(new DataResultModel(true, '', {}));
    }

})(module);