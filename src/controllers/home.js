(function (module) {
    
    "use strict";
    
    module.exports.setRoutes = function (app) {
        app.get('/', function (req, res, next) {
            //res.sendFile('../public/index.html', { root: __dirname });
            res.redirect(301, '/public/index.html');
        });

        app.get('/home', function (req, res, next) {
            res.redirect(301, '/public/layout.html');
        });
    };

})(module);