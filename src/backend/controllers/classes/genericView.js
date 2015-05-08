(function (module) {

    "use strict";

    module.exports = GenericView;

    var util = require('../../libs/commonFunctions');
    var commonController = require('../../controllers/common');
    var config = require('../../libs/config');
    var DataResultModel = require('../../models/dataResult');

    function GenericView() {

    }

    GenericView.prototype.viewIndexModel = function (req, cb) {

        cb(null, {});

    };

    GenericView.prototype.viewIndex = function (app, req, res, next) {

        if (req.myInfo.IsSEORequest) {

            this.viewIndexModel(req, function (err, result) {

                if (err) {
                    return next(err);
                }

                res.render(req.myInfo.viewPath, util.extend(req.myInfo, result));
            });

        }
        else {

            res.sendFile(req.myInfo.viewPath, {
                root: app.get('views')
            });

        }

    };

    GenericView.prototype.viewIndexJson = function (app, req, res, next) {

        this.viewIndexModel(req, function (err, result) {

            if (err) {
                return next(err);
            }

            res.json(util.extend(req.myInfo, result));
        });

    };

})(module);