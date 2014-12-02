(function (module) {
    
    "use strict";
    
    module.exports.setRoutes = function (app) {
        app.get('/', function (req, res, next) {
            res.sendFile('public/index.html', { root: __dirname });
        });
    };

})(module);