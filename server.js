(function (module) {

    'user strict';

    var express = require('express');
    var favicon = require('serve-favicon');
    var methodOverride = require('method-override');
    var path = require('path');
    var compression = require('compression');
    var passport = require('passport');
    var bodyParser = require('body-parser');
    var config = require('./src/backend/libs/config');
    var mongoose = require('./src/backend/libs/db');
    var log = require('./src/backend/libs/log')(module);
    var cookieParser = require('cookie-parser');
    var i18n = require('i18n-2');
    var util = require('util');
    var exphbs = require('express-handlebars');
    var thisPackage = require('./package.json');




    var authController = require('./src/backend/controllers/auth');
    var usersController = require('./src/backend/controllers/users');
    var testsController = require('./src/backend/controllers/tests');
    var languagesController = require('./src/backend/controllers/languages');
    var themesController = require('./src/backend/controllers/themes');

    var ErrorHandled = require('./src/backend/models/errorHandled');
    var routingHandler = require('./src/backend/routing/routes');
    var GlobalizeController = require('./src/backend/controllers/globalize');

    var app = express();

    app.set('root', __dirname + '/src/frontend/public-build/');
    app.set('bower_components', __dirname + '/src/frontend/bower_components/');
    app.set('views', __dirname + (process.env.NODE_ENV === 'production' ? '/src/frontend/public-build/views/' : '/src/frontend/public/views/'));
    app.set('port', config.get('port'));


    app.use(cookieParser(config.get('encryptKeyForCookieParser')));

    app.use(favicon(app.get('root') + 'favicon.ico'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(methodOverride('X-HTTP-Method-Override'));
    app.use(compression());

    app.engine('handlebars', exphbs({
        layoutsDir: app.get('views') + 'layouts/',
        defaultLayout: 'layoutRequire'
    }));
    app.set('view engine', 'handlebars');


    i18n.expressBind(app, config.get("i18n"));



    mongoose.dbInit(function (err, cnn) {

    });

    new GlobalizeController().initCldrData(function (err) {

        console.log("GlobalizeController().initCldrData Finisehd");

        if (process.env.NODE_ENV === 'test') {
            testsController.initTestEnvironment(app);
        }





        //begin -> set public static
        app.use('/public/scripts', express.static(app.get('root') + 'scripts', {
            maxAge: process.env.NODE_ENV === 'production' ? 86400000 : 0
        }));
        app.use('/public/bower_components', express.static(app.get('bower_components'), {
            maxAge: process.env.NODE_ENV === 'production' ? 86400000 : 0
        }));
        app.use('/public/cdn', express.static(app.get('root') + 'cdn', {
            maxAge: process.env.NODE_ENV === 'production' ? 86400000 : 0
        }));
        app.use('/public/fonts', express.static(app.get('bower_components') + 'components-font-awesome/fonts', {
            maxAge: process.env.NODE_ENV === 'production' ? 86400000 : 0
        }));
        app.use('/public/images', express.static(app.get('root') + 'images', {
            maxAge: process.env.NODE_ENV === 'production' ? 86400000 : 0
        }));
        //end -> set public static content folders





        routingHandler.setRoutes(app, log, authController);

        //programmer errors
        process.on('uncaughtException', function (err) {
            try {
                //try logging

                console.log(err.stack);

                log.error(err);

            } catch (errLogging) {

                try {
                    //try sending email
                    //sendMail.error(err);
                } catch (errSendingEmail) {
                    // do nothing here

                }
            }
            process.exit(1);
        });


        console.log("//Start listening");

        app.listen(app.get('port'), function () {

            var d = new Date();

            log.info("********************************************************************");
            log.info("Express server listening : " + util.format('%s', d.toString()));
            log.info('Express server listening on port ' + app.get('port'));
            log.info("********************************************************************");



        });



    });












})(module);