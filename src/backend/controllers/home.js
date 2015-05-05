(function (module) {

    "use strict";

    module.exports.index = index;
    module.exports.indexJSON = indexJSON;

    var config = require('../libs/config');
    var pkg = require('../../../package.json');
    var i18n = require('i18n-2');
    var util = require('../libs/commonFunctions');
    var utilsNode = require('util');
    var commonController = require('../controllers/common');


    function indexBaseModel(app, req, res, next) {
        var viewPath = 'home/index.handlebars';
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
            res.render(tplInfo.viewPath, tplInfo.viewModel);
        }
        else {
            res.sendFile(tplInfo.viewPath, {
                root: app.get('views')
            });
        }
    }

    function indexJSON(app, req, res, next) {

        var tplInfo = indexBaseModel(app, req, res, next);
        res.json(tplInfo.viewModel);
    }

})(module);