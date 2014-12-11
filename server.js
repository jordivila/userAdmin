(function (module) {
    
    'user strict';
    
    var express = require('express');
    var favicon = require('serve-favicon');
    var methodOverride = require('method-override');
    var path = require('path');
    var compression = require('compression');
    var passport = require('passport');
    var bodyParser = require('body-parser');
    var config = require('./src/libs/config');
    var mongoose = require('./src/libs/db').mongoose;
    var log = require('./src/libs/log')(module);
    var cookieParser = require('cookie-parser');
    var i18n = require('i18n-2');
    
    
    var authController = require('./src/controllers/auth');
    var homeController = require('./src/controllers/home');
    var usersController = require('./src/controllers/users');
    var commonController = require('./src/controllers/common');
    
    var app = express();
    
    app.use(cookieParser(config.get('encryptKeyForCookieParser')));
    app.set('port', process.env.PORT || config.get('port'));
    app.use(favicon(__dirname + '/src/public/favicon.ico'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(methodOverride('X-HTTP-Method-Override'));
    app.use(compression());
    
    
    
    
    
    
    i18n.expressBind(app, config.get("i18n"));

    // set up the middleware
    app.use(function (req, res, next) {
        //log.info('\n found URL: %s', req.url); // log all requests
        req.i18n.setLocaleFromCookie();
        next();
    });
    
    
    if ((process.env.NODE_ENV === 'test') || (process.env.NODE_ENV === 'dev')) {
        commonController.setAccessControlOrigin(app);
    }
    
    log.info("environment->" + process.env.NODE_ENV);
    
    //set the Cache-Control header to one day using milliseconds
    app.use('/public', express.static(__dirname + '/src/public', { maxAge: process.env.NODE_ENV === 'production' ? 86400000:0 }));


    
    homeController.setRoutes(app);
    usersController.setRoutes(app, authController);
    commonController.setRoutes(app, log);
    
    //programmer errors
    process.on('uncaughtException', function (err) {
        try {
            //try logging
            log.error(err);
        }
    catch (errLogging) {
            
            try {
                //try sending email
                log.error(err);
            }
        catch (errSendingEmail) { 
            // do nothing here
            }
        }
        process.exit(1);
    });
    
    
    app.listen(app.get('port'), function () {
        log.info('Express server listening on port ' + app.get('port'));
    });

})(module);