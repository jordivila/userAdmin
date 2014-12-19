(function(module) {

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
    var util = require('util');


    var authController = require('./src/controllers/auth');
    var homeController = require('./src/controllers/home');
    var usersController = require('./src/controllers/users');
    var commonController = require('./src/controllers/common');
    var ErrorHandled = require('./src/models/errorHandled');

    var app = express();

    app.use(cookieParser(config.get('encryptKeyForCookieParser')));
    app.set('port', process.env.PORT || config.get('port'));
    app.use(favicon(__dirname + '/src/public/favicon.ico'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(methodOverride('X-HTTP-Method-Override'));
    app.use(compression());



    i18n.expressBind(app, config.get("i18n"));

    // set up the middleware
    app.use(function(req, res, next) {
        req.i18n.setLocaleFromCookie();

        //log.info('\n request URL: %s', req.url); // log all requests
        //log.info('\n locale : %s', req.i18n.getLocale()); // log all requests

        next();
    });


    if ((process.env.NODE_ENV === 'test') || (process.env.NODE_ENV === 'dev')) {
        commonController.setAccessControlOrigin(app);
    }



    //set the Cache-Control header to one day using milliseconds
    app.use('/public', express.static(__dirname + '/src/public', {
        maxAge: process.env.NODE_ENV === 'production' ? 86400000 : 0
    }));



    homeController.setRoutes(app);
    usersController.setRoutes(app, authController);
    commonController.setRoutes(app, log);

    //programmer errors
    process.on('uncaughtException', function(err) {
        try {
            //try logging

            console.log(err.stack);
            /*
            console.log("******************Unexcpected Error**************************");
            for (var i in err) {
                console.log("\n err->" + i + "=" + err[i]);
            }
            */

            //console.log("isInstanceof ErrorHandled->" + (err instanceof ErrorHandled).toString());



            log.error(err);

        } catch (errLogging) {

            try {
                //try sending email
                console.log(errLogging);
                log.error(err);
            } catch (errSendingEmail) {
                // do nothing here

            }
        }
        process.exit(1);
    });


    app.listen(app.get('port'), function() {

        var d = new Date();

        log.info("********************************************************************");
        log.info("Express server listening : " + util.format('%s', d.toString()));
        log.info('Express server listening on port ' + app.get('port'));
        log.info("********************************************************************");
    });

})(module);