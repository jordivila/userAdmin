(function (module) {

    'user strict';

    var express = require('express');
    var favicon = require('serve-favicon');
    var methodOverride = require('method-override');
    var compression = require('compression');
    var passport = require('passport');
    var bodyParser = require('body-parser');
    var config = require('./src/backend/libs/config');
    var DbController = require('./src/backend/controllers/db');
    var log = require('./src/backend/libs/log')(module);
    var cookieParser = require('cookie-parser');
    var i18n = require('i18n-2');
    var util = require('util');
    var exphbs = require('express-handlebars');
    var authController = require('./src/backend/controllers/auth');
    var testsController = require('./src/backend/controllers/tests');
    var routingHandler = require('./src/backend/routing/routes');
    var GlobalizeController = require('./src/backend/controllers/globalize');
    var app = express();
    var usePreCompiled = config.get('clientApp:usePreCompiled');
    var handleBarsHelpers = require('./src/crossLayer/handleBarsHelper');

    app.enable('strict routing');

    app.set('root', usePreCompiled === true ? (__dirname + '/src/frontend/public-build/') : (__dirname + '/src/frontend/public/'));
    app.set('crossLayer', __dirname + '/src/crossLayer/');
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
        defaultLayout: 'layoutRequire',
        helpers: handleBarsHelpers
    }));
    app.set('view engine', 'handlebars');


    i18n.expressBind(app, config.get("i18n"));

    new DbController().CnnOpen(function (err, cnn) {


    });

    new GlobalizeController().initCldrData(function (err) {

        if (err) {
            log.error("Error initializing GlobalizeController.initCldrData()");
        }
        else {
            log.info("GlobalizeController().initCldrData Finished ok");
        }

    });




    if (process.env.NODE_ENV === 'test') {
        testsController.initTestEnvironment(app);
    }


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

    app.listen(app.get('port'), function () {

        var d = new Date();

        log.info("********************************************************************");
        log.info("Express server listening : " + util.format('%s', d.toString()));
        log.info('Express server listening on port ' + app.get('port'));
        log.info("********************************************************************");

    });













})(module);