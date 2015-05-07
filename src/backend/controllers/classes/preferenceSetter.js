(function (module) {

    "use strict";

    module.exports = PreferenceSetter;

    var util = require('../../libs/commonFunctions');
    var commonController = require('../../controllers/common');
    var config = require('../../libs/config');
    var DataResultModel = require('../../models/dataResult');

    function PreferenceSetter(cookieName, defaultValue) {

        this.data = [];
        this.cookieName = cookieName;
        this.defaultValue = defaultValue;
    }

    PreferenceSetter.prototype.Data = function (value) {
        if (value) {
            this.data = Data;
        }
        else {
            return this.data;
        }
    };

    PreferenceSetter.prototype.getAll = function (req, cb) {
        cb(null, this.data);
    };

    PreferenceSetter.prototype.update = function (req, res, next) {

        commonController.setCookie(res, this.cookieName, req.body.newValue);

        res.json(new DataResultModel(true, '', {}));

    };

    PreferenceSetter.prototype.initRequest = function (req, res) {

        if (req.cookies[this.cookieName]) {

        }
        else {
            commonController.setCookie(res, this.cookieName, this.defaultValue);
        }

    };

    PreferenceSetter.prototype.viewIndexModel = function (req, cb) {

        this.getAll(req, function (err, getAllResult) {

            if (err) {
                return cb(err);
            }

            cb(null, { itemList: getAllResult });
        });

    };

    PreferenceSetter.prototype.viewIndex = function (app, req, res, next) {

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

    PreferenceSetter.prototype.viewIndexJson = function (app, req, res, next) {

        this.viewIndexModel(req, function (err, result) {

            if (err) {
                return next(err);
            }

            res.json(util.extend(req.myInfo, result));
        });

    };

})(module);