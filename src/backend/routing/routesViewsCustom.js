(function (module) {

    "use strict";

    var util = require('../libs/commonFunctions');
    var utilsNode = require('util');
    var BaseController = require('../controllers/classes/base');


    var baseController = new BaseController();

    module.exports.setRoutes = function (app) {

        app.get('/uicontrols/*/*', function (req, res, next) {

            baseController.setViewModelBase(req);

            if (req.params[1] === '') {

                //get template json config -> jsFiles, CssFiles, controllerInterface, etc
                var modelTemplate = utilsNode.format(app.get('views') + '/%s/index.handlebars.json', req.params[0]);

                //extend common layout model with template config
                var m = util.extend(req.viewModel, require(modelTemplate));

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