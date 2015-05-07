(function (module) {

    "use strict";

    var util = require('../libs/commonFunctions');
    var utilsNode = require('util');
    var commonController = require('../controllers/common');
    var languagesController = require('../controllers/languages');
    var homeController = require('../controllers/home');
    var themesController = require('../controllers/themes');


    module.exports.setRoutes = function (app) {

        app.get('/uicontrols/*/*', function (req, res, next) {

            if (req.params[1] === '') {

                //get template json config -> jsFiles, CssFiles, controllerInterface, etc
                var modelTemplate = utilsNode.format(app.get('views') + '/%s/index.handlebars.json', req.params[0]);

                //extend common layout model with template config
                var m = util.extend(req.myInfo, require(modelTemplate));

                //do render     
                if (m.IsSEORequest) {
                    //render SEO friendly layout + template
                    res.render(req.params[0] + '/index.handlebars', m);
                }
                else {
                    //return template and let frontend engine render results
                    res.sendFile(req.params[0] + '/index.handlebars', {
                        root: app.get('views')
                    });
                }
            }
            else {
                // browser requesting a resource -> *.js, *.png, *.css
                var pathName = req._parsedUrl.pathname.replace('/uicontrols', '');
                res.sendFile(pathName, {
                    root: app.get('views')
                });

            }
        });

    };

})(module);