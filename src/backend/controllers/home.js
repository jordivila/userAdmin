(function (module) {

    "use strict";

    module.exports.viewIndex = viewIndex;
    module.exports.viewIndexJson = viewIndexJson;

    var markdown = require("markdown").markdown;
    var fs = require('fs');
    var GenericViewController = require('./classes/genericView');


    function HomeController() {
        GenericViewController.apply(this, {});
    }
    HomeController.prototype = new GenericViewController();
    HomeController.prototype.ReadMeMarkDownContent = null; // shared between instances
    HomeController.prototype.viewIndexModel = function (req, cb) {

        var self = this;

        if (this.ReadMeMarkDownContent === null) {

            var readmeFilePath = __dirname + '../../../../README.md';

            fs.readFile(readmeFilePath, 'utf8', function (err, data) {

                if (err) {
                    return cb(err);
                }

                self.ReadMeMarkDownContent = markdown.toHTML(data);

                cb(null, { ReadmeMarkDown: self.ReadMeMarkDownContent });

            });
        }
        else {
            cb(null, { ReadmeMarkDown: this.ReadMeMarkDownContent });
        }
    };

    var homeController = new HomeController();

    function viewIndexModel(req, cb) {
        homeController.viewIndexModel(req, cb);
    }

    function viewIndex(app, req, res, next) {
        homeController.viewIndex(app, req, res, next);
    }

    function viewIndexJson(app, req, res, next) {
        homeController.viewIndexJson(app, req, res, next);
    }

})(module);