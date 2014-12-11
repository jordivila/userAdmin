(function (module) {
    
    "use strict";
    
    module.exports.setRoutes = function (app, log) {
        
        //catch 404
        app.use(function (req, res, next) {
            log.info('Not found URL: %s', req.url);
            
            res.status(404);
            res.send({});
        });
        
        //operational errors
        app.use(function (err, req, res, next) {
            if (!err) return next();
            
            console.log(err.message);
            console.log(err.stack);
            
            log.error(err);
            res.status(err.status || 500);
            res.send({}); // do not send error messages as it can send private info

        });
    };

    module.exports.setAccessControlOrigin = function (app) {
        // This is not intended for production environments


        app.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.setHeader('Access-Control-Allow-Headers', 'Authorization');
            // Pass to next layer of middleware
            next();
        });

    };

})(module);