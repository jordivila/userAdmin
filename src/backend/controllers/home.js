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

        if (req.myInfo.IsSEORequest) {
            res.render(req.myInfo.viewPath, req.myInfo);
        }
        else {
            res.sendFile(req.myInfo.viewPath, {
                root: app.get('views')
            });
        }
    }

    function indexJSON(app, req, res, next) {

        res.json(req.myInfo);
    }

})(module);