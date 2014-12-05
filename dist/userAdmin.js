(function (module) {
    
    "use strict";
    
    // Load required packages
    var passport = require('passport');
    var BasicStrategy = require('passport-http').BasicStrategy;
    var User = require('../models/users');

    passport.use(new BasicStrategy(
            function (username, password, callback) {
                User.findOne({ username: username }, function (err, user) {
                    if (err) { return callback(err); }
                    
                    // No user found with that username
                    if (!user) { return callback(null, false); }
                    
                    // Make sure the password is correct
                    user.verifyPassword(password, function (err, isMatch) {
                        if (err) { return callback(err); }
                        
                        // Password did not match
                        if (!isMatch) { return callback(null, false); }
                        
                        // Success
                        return callback(null, user);
                    });
                });
            }
        ));
    
    module.exports.isAuthenticated = passport.authenticate('basic', { session : false });

})(module);;(function (module) {
    
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

})(module);;(function (module) {
    
    "use strict";
    
    module.exports.setRoutes = function (app) {
        app.get('/', function (req, res, next) {
            res.sendFile('public/index.html', { root: __dirname });
        });
    };

})(module);;(function (module) {
    
    "use strict";
    
    var log = require('../libs/log')(module);
    var UserModel = require('../models/users');
    
    function create(userReq, cb) {
        
        var userReqModel = new UserModel(userReq);
        
        var result = {
            isValid : null,
            messages : [],
            userId: null
        };
        
        UserModel.findOne({ username : userReqModel.username }, function (err, user) {
            if (err) {
                cb(err);
            }
            if (!user) {
                userReqModel.save(function (err, userCreated) {
                    if (err) {
                        cb(err);
                    }
                    else {
                        result.isValid = true;
                        result.userId = userCreated.userId;
                        result.messages.push("User created");
                        cb(null, result);
                    }
                });
            }
            else {
                result.isValid = false;
                result.messages.push("User already exists");
                cb(null, result);
            }
        });
    }
    
    
    
    

    module.exports.create = create;

    module.exports.setRoutes = function (app, authController) {
        
        app.get('/api/user',
                authController.isAuthenticated,
                function (req, res) {
            res.json({
                user: req.user // passport sets user object when authenticated
            });
        });
        
        app.post('/api/user', function (req, res, next) {
            var result = create(req.body, function (err, user) {
                if (err) {
                    next(err);
                }
                else {
                    res.json(user);
                }
            });
        });
    };

    
    

})(module);;var config = require('nconf');
//

var p = 'src/config.json';
console.log(p);

config.argv()
    .env()
    .file({ file: p })// relative to application entry
;



module.exports = config;
;var mongoose    = require('mongoose');
var log         = require('../libs/log')(module);
var config      = require('../libs/config');


mongoose.connect(process.env.CUSTOMCONNSTR_MONGOLAB_URI || config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

module.exports.mongoose = mongoose;;var winston = require('winston');

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/');

    return new winston.Logger({
        transports : [
            new winston.transports.Console({
                colorize:   true,
                level:      'debug',
                label:      path
            })
        ]
    });
}

module.exports = getLogger;;(function (module) {
    
    "use strict";
    
    // Load required packages
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');
    
    // Define our user schema
    var UserSchema = new mongoose.Schema({
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    });
    
    
    UserSchema
    .virtual('userId')
        .get(function () {
            return this.id;
        });

    // Execute before each user.save() call
    UserSchema.pre('save', function (callback) {
        var user = this;
        
        // Break out if the password hasn't changed
        if (!user.isModified('password')) return callback();
        
        // Password changed so we need to hash it
        bcrypt.genSalt(5, function (err, salt) {
            if (err) return callback(err);
            
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) return callback(err);
                user.password = hash;
                callback();
            });
        });
    });
    
    UserSchema.methods.verifyPassword = function (password, cb) {
        bcrypt.compare(password, this.password, function (err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };
    
    // Export the Mongoose model
    module.exports = mongoose.model('User', UserSchema);

})(module);;(function (module) {
    
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

    var authController = require('./controllers/auth');
    var homeController = require('./controllers/home');
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
    //set the Cache-Control header to one day using milliseconds
    app.use(express.static(__dirname + '/public', { maxAge: process.env.NODE_ENV === 'production' ? 86400000:0 }));

    
    if ((process.env.NODE_ENV === 'test') || (process.env.NODE_ENV === 'dev')) {
        commonController.setAccessControlOrigin(app);
    }
    
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