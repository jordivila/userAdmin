(function (module) {

    "use strict";

    module.exports = HomeController;

    var markdown = require("markdown").markdown;
    var fs = require('fs');
    var GenericViewController = require('./classes/genericView');

    function HomeController() {
        GenericViewController.apply(this, arguments);
    }
    HomeController.prototype = new GenericViewController();
    HomeController.prototype.ReadMeMarkDownContent = null; // shared between instances !!
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

})(module);