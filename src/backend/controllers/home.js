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



    function index(app, req, res, next) {

        var tplInfo = commonController.getViewModel(app, req, 'home');

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

        var tplInfo = commonController.getViewModel(app, req, 'home');

        res.json(tplInfo.viewModel);
    }

})(module);