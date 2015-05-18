(function (module) {

    "use strict";

    module.exports = GenericView;

    var util = require('../../libs/commonFunctions');
    //var commonController = require('../../controllers/common');
    var config = require('../../libs/config');
    //var DataResultModel = require('../../models/dataResult');
    var BaseController = require('./base');

    function GenericView() {
        BaseController.apply(this, arguments);
    }

    GenericView.prototype = new BaseController();

    GenericView.prototype.setViewInfo = function (app, req, route) {
        var viewPath = route + '/index.handlebars';
        var viewModelPath = app.get('views') + '/' + viewPath + '.json';

        req.viewModel = util.extend(req.viewModel, require(viewModelPath));

        //req.viewModel.JsFiles
        for (var i = 0; i < req.viewModel.JsFiles.length; i++) {
            req.viewModel.JsFiles[i] = req.viewModel.JsFiles[i].replace('{{Package.name}}', req.viewModel.Package.name).replace('{{Package.version}}', req.viewModel.Package.version);
        }


        req.viewInfo = {
            viewPath: viewPath,
            viewModelPath: viewModelPath
        };
    };

    GenericView.prototype.viewIndexModel = function (req, cb) {

        cb(null, {});

    };

    GenericView.prototype.viewIndex = function (app, req, res, next) {

        if (req.viewModel.IsSEORequest) {

            this.viewIndexModel(req, function (err, result) {

                if (err) {
                    return next(err);
                }

                res.render(req.viewInfo.viewPath, util.extend(req.viewModel, result));
            });

        }
        else {

            res.sendFile(req.viewInfo.viewPath, {
                root: app.get('views')
            });

        }

    };

    GenericView.prototype.viewIndexJson = function (app, req, res, next) {

        this.viewIndexModel(req, function (err, result) {

            if (err) {
                return next(err);
            }

            res.json(util.extend(req.viewModel, result));
        });

    };

})(module);