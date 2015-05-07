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
    var markdown = require("markdown").markdown;
    var fs = require('fs');

    var readMeMarkDownContent = null;

    function viewIndexModel(cb) {

        if (readMeMarkDownContent === null) {
            fs.readFile(__dirname + '../../../../README.md', 'utf8', function (err, data) {
                if (err) {
                    return cb(err);
                }

                readMeMarkDownContent = markdown.toHTML(data);

                cb(null, { ReadmeMarkDown: readMeMarkDownContent });
            });
        }
        else {
            cb(null, { ReadmeMarkDown: readMeMarkDownContent });
        }

    }




    function index(app, req, res, next) {

        if (req.myInfo.IsSEORequest) {

            viewIndexModel(function (err, result) {

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
    }

    function indexJSON(app, req, res, next) {

        viewIndexModel(function (err, result) {

            if (err) {
                return next(err);
            }

            res.json(util.extend(req.myInfo, result));
        });
    }

})(module);