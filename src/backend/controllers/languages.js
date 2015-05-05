(function (module) {

    "use strict";

    module.exports.initRequestLanguage = initRequestLanguage;
    module.exports.index = index;
    module.exports.indexJSON = indexJSON;
    module.exports.getAll = getAll;
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
    var languagesController = require('../controllers/languages');


    function sendCookie(res, langId) {
        res.cookie(config.get('i18n:cookieName'), langId, { expires: new Date(Date.now() + 900000), httpOnly: true });
    }

    function initRequestLanguage(req, res) {

        req.i18n.setLocaleFromCookie();

        if (req.cookies[config.get('i18n:cookieName')]) {

        }
        else {
            sendCookie(res, req.i18n.getLocale());
        }
    }

    function getAll(req, cb) {

        var viewModel = {
            LangsAvailable: [
                {
                    id: "es",
                    name: 'Español'
                },
                {
                    id: "cat",
                    name: 'Català'
                },
                {
                    id: "en",
                    name: 'English'
                }]
        };

        cb(null, viewModel);
    }

    function indexBaseModel(app, req, res, next) {
        var viewPath = 'languages/index.handlebars';
        var viewModelPath = app.get('views') + '/' + viewPath + '.json';
        var viewModel = commonController.getModelMerged(req, require(viewModelPath));
        return {
            viewPath: viewPath,
            viewModel: viewModel
        };
    }

    function index(app, req, res, next) {

        var tplInfo = indexBaseModel(app, req, res, next);

        if (tplInfo.viewModel.IsSEORequest) {

            getAll(req, function (err, result) {
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

        var tplInfo = indexBaseModel(app, req, res, next);

        getAll(req, function (err, result) {

            if (err) {
                return next(err);
            }

            res.json(util.extend(tplInfo.viewModel, result));
        });
    }

    function update(req, res, next) {

        var langValue = req.body.localeNewValue;

        sendCookie(res, langValue);

        res.json(new DataResultModel(true, '', {}));
    }

})(module);