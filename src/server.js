(function (module) {
    
    'user strict';
    
    var express = require('express');
    var favicon = require('serve-favicon');
    var methodOverride = require('method-override');
    var path = require('path');
    var compression = require('compression');
    var passport = require('passport');
    var bodyParser = require('body-parser');
    var config = require('./libs/config');
    var mongoose = require('./libs/db').mongoose;
    var log = require('./libs/log')(module);

    var oauth2Controller = require('./controllers/oauth2');
    var authController = require('./controllers/auth');
    var homeController = require('./controllers/home');
    var clientController = require('./controllers/client');
    var usersController = require('./controllers/users');
    var commonController = require('./controllers/common');
    
    var app = express();
    app.set('port', process.env.PORT || config.get('port'));
    app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(methodOverride('X-HTTP-Method-Override'));
    app.use(compression());
    
    
    
    if ((process.env.NODE_ENV === 'test') || (process.env.NODE_ENV === 'dev')) {
        
        app.use(express.static(__dirname + '/public', { maxAge: 0 }));
        
        commonController.setAccessControlOrigin(app);
        // testing authentication needs clientId's pregenerated
        // allowing this at test time lets me create those pregenrated clients
        app.post('/api/client', clientController.postClients);
    }
    else { 
        //set the Cache-Control header to one day using milliseconds
        app.use(express.static(__dirname + '/public', { maxAge: 86400000 })); 
    }
    
    
    homeController.setRoutes(app);
    oauth2Controller.setRoutes(app);
    usersController.setRoutes(app, oauth2Controller);
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