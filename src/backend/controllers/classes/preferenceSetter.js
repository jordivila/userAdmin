(function (module) {

    "use strict";

    module.exports = PreferenceSetter;

    var util = require('../../libs/commonFunctions');
    var config = require('../../libs/config');
    var DataResultModel = require('../../models/dataResult');
    var GenericViewController = require('./genericView');

    function PreferenceSetter(cookieName, defaultValue) {

        this.data = [];

        GenericViewController.apply(this, {});
    }

    PreferenceSetter.prototype = new GenericViewController();

    PreferenceSetter.prototype.cookieName = '';

    PreferenceSetter.prototype.cookieValueGet = function (req) {
        return req.cookies[this.cookieName];
    };

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

        this.setCookieClientAccess(res, this.cookieName, req.body.newValue);

        res.json(new DataResultModel(true, '', {}));

    };

    PreferenceSetter.prototype.initRequest = function (req, res) {

        if (req.cookies[this.cookieName]) {

        }
        else {
            this.setCookieClientAccess(res, this.cookieName, this.cookieValueGet(req));
        }

    };

    PreferenceSetter.prototype.viewIndexModel = function (req, cb) {

        this.getAll(req, function (err, getAllResult) {

            if (err) {
                return cb(err);
            }

            cb(null, {
                itemList: getAllResult
            });
        });

    };

})(module);