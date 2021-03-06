﻿(function (module) {

    "use strict";

    module.exports = GenericView;

    var util = require('../../libs/commonFunctions');
    var config = require('../../libs/config');
    var BaseController = require('./base');
    var fs = require('fs');


    function GenericView() {
        BaseController.apply(this, arguments);
    }

    GenericView.prototype = new BaseController();
    GenericView.prototype.setViewInfo = function (app, req, route) {

        //var viewPath = route + '/index.handlebars';
        //var viewModelPath = app.get('views') + '/' + viewPath + '.json';
        //req.viewModel = util.extend(req.viewModel, require(viewModelPath));

        //if (req.viewModel.title) {
        //    req.viewModel.title = req.i18n.__(req.viewModel.title);
        //}

        //req.viewInfo = {
        //    viewPath: viewPath,
        //    viewModelPath: viewModelPath
        //};


        //console.log(req.viewInfo);

        var reqType = this.getRequestType(req);
        var pathname = req._parsedUrl.pathname.substr(1);
        var viewPath = pathname + (reqType.isView === true ? 'index.handlebars' : '');
        var viewModelPath = app.get('views') + '/' + viewPath + (reqType.isView === true ? '.json' : '');

        if (reqType.isViewModel === true)
        {
            viewPath = viewPath.replace('.json','');
        }

        req.viewModel = util.extend(req.viewModel, require(viewModelPath));

        if (req.viewModel.title) {
            req.viewModel.title = req.i18n.__(req.viewModel.title);
        }

        req.viewInfo = {
            viewPath: viewPath,
            viewModelPath: viewModelPath
        };

    };
    GenericView.prototype.viewIndexModel = function (req, res, cb) {

        cb(null, {});

    };
    GenericView.prototype.viewIndex = function (app, req, res, next) {

        if (req.viewModel.isSEORequest) {

            this.viewIndexModel(req, res, function (err, result) {

                if (err) {
                    return next(err);
                }

                req.viewModel.viewModel = result;

                res.render(req.viewInfo.viewPath, req.viewModel);
            });

        } else {

            res.sendFile(req.viewInfo.viewPath, {
                root: app.get('views')
            });

        }

    };
    GenericView.prototype.viewIndexJson = function (app, req, res, next) {

        //var getTexts = this.viewI18nTextsCacheGet;
        var self = this;

        this.viewIndexModel(req, res, function (err, result) {

            if (err) {
                return next(err);
            }

            self.viewI18nTextsCacheGet(app, req, function (errTexts, i18nTexts) {

                if (errTexts) {
                    return next(errTexts);
                }

                //result.viewModel = result;
                result.i18nTexts = i18nTexts;

                res.json(util.extend(req.viewModel, {
                    viewModel: result
                }));

            });

        });

    };
    GenericView.viewI18nTextsCacheKeys = []; // static !!!
    GenericView.viewI18nTextsCacheValues = {}; // static !!!
    GenericView.prototype.viewI18nTextsCacheGet = function (app, req, cb) {

        var self = this;
        var cacheKey = req.i18n.locale + req.viewInfo.viewPath;
        var sendTexts = function () {
            cb(null, GenericView.viewI18nTextsCacheValues[cacheKey]);
        };

        if (GenericView.viewI18nTextsCacheKeys.indexOf(cacheKey) == -1) {

            self.viewI18nTextsCacheBuild(app, req, function (err, texts) {

                if (err) {
                    cb(err);
                } else {

                    GenericView.viewI18nTextsCacheKeys.push(cacheKey);
                    GenericView.viewI18nTextsCacheValues[cacheKey] = texts;

                    sendTexts();
                }
            });
        } else {

            sendTexts();
        }
    };
    GenericView.prototype.viewI18nTextsCacheBuild = function (app, req, cb) {
        /*
            Find i18n resources in handlebars templates -> {{{__ "someI18nTextKey"}}}
            And add them to json model requests
            So, handlebars can render i18n texts at client side & server side
        */

        // 1.- get view path
        var viewPath = app.get('views') + req.viewInfo.viewPath;

        // 2.- read view  contents
        fs.readFile(viewPath, {
            encoding: 'utf8'
        }, function (err, data) {

            if (err) return cb(err);

            // 3.- find view i18n keys

            try {

                if (data) {

                    // 4.- get view page specific texts in use 
                    //     and store them in an object to be return
                    var i18nTexts = {};

                    var myRegexp = /{{{__\s*(("|')([^}]+)("|'))}}}/g; //--> match {{{__ "SomeText"}}}
                    var match = myRegexp.exec(data);

                    while (match !== null) {
                        //regular expression groups are enclosed in"()" 

                        // matched text: match[0]
                        // match start: match.index
                        // capturing group n: match[n]

                        var i18nTextKey = match[3];

                        i18nTexts[i18nTextKey] = req.i18n.locales[req.i18n.locale][i18nTextKey];

                        match = myRegexp.exec(data);
                    }

                    cb(null, i18nTexts);

                } else {
                    cb(null, {});
                }

            } catch (e) {
                cb(e, {});
            }

        });

    };

})(module);