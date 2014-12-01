(function () {
    
    "use strict";
    
    
    var config = require('../libs/config');
    var passport = require('passport');
    var BasicStrategy = require('passport-http').BasicStrategy;
    var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
    var BearerStrategy = require('passport-http-bearer').Strategy;
    var UserModel = require('../models/users').UserModel;
    var ClientModel = require('../models/client').ClientModel;
    var AccessTokenModel = require('../models/accessToken').AccessTokenModel;
    var RefreshTokenModel = require('../models/refreshToken').RefreshTokenModel;
    
    passport.use(new BasicStrategy(
            function (username, password, done) {
                ClientModel.findOne({ clientId: username }, function (err, client) {
                    if (err) { return done(err); }
                    if (!client) { return done(null, false); }
                    if (client.clientSecret != password) { return done(null, false); }
                    
                    return done(null, client);
                });
            }
        ));
    
    passport.use(new ClientPasswordStrategy(
            function (clientId, clientSecret, done) {
                ClientModel.findOne({ clientId: clientId }, function (err, client) {
                    if (err) { return done(err); }
                    if (!client) { return done(null, false); }
                    if (client.clientSecret != clientSecret) { return done(null, false); }
                    
                    return done(null, client);
                });
            }
        ));
    
    passport.use(new BearerStrategy(
            function (accessToken, done) {
                AccessTokenModel.findOne({ token: accessToken }, function (err, token) {
                    if (err) { return done(err); }
                    if (!token) { return done(null, false); }
                    
                    if (Math.round((Date.now() - token.created) / 1000) > config.get('security:tokenLife')) {
                        AccessTokenModel.remove({ token: accessToken }, function (err) {
                            if (err) return done(err);
                        });
                        return done(null, false, { message: 'Token expired' });
                    }
                    
                    UserModel.findById(token.userId, function (err, user) {
                        if (err) { return done(err); }
                        if (!user) { return done(null, false, { message: 'Unknown user' }); }
                        
                        var info = { scope: '*' };
                        done(null, user, info);
                    });
                });
            }
        ));
})();;(function () {
    
    "use strict";
    
    var log = require('../libs/log')(module);
    var ClientModel = require('../models/client').ClientModel;
    
    // Create endpoint /api/users for POST
    
    function create(clientReq, cb) {
        
        var result = {
            isValid : null,
            messages : [],
            clientId: null
        };
        
        var clientReqModel = new ClientModel(clientReq);
        
        ClientModel.findOne({ name : clientReq.name }, function (err, client) {
            if (err) {
                cb(err);
            }
            if (!client) {
                clientReqModel.save(function (err, clientCreated) {
                    if (err) {
                        cb(err);
                    }
                    else {
                        result.isValid = true;
                        result.clientId = clientCreated.clientId;
                        result.messages.push("Client created");
                        cb(null, result);
                    }
                });
            }
            else {
                result.isValid = false;
                result.messages.push("Client already exists");
                cb(null, result);
            }
        });
    }
    
    exports.create = create;
    exports.postClients = function (req, res, next) {
        var result = create(req.body, function (err, user) {
            
            if (err) {
                next(err);
            }
            else {
                res.json(user);
            }
        });
    };
})();;(function () {
    
    "use strict";
    
    var mongoose = require('mongoose');
    var oauth2orize = require('oauth2orize');
    var passport = require('passport');
    var crypto = require('crypto');
    var config = require('../libs/config');
    var UserModel = require('../models/users').UserModel;
    var AccessTokenModel = require('../models/accessToken').AccessTokenModel;
    var RefreshTokenModel = require('../models/refreshToken').RefreshTokenModel;
    
    
    
    // create OAuth 2.0 server
    var server = oauth2orize.createServer();
    
    // Generic error handler
    var errFn = function (cb, err) {
        if (err) { return cb(err); }
    };
    
    
    
    // Destroys any old tokens and generates a new access and refresh token
    var generateTokens = function (modelData, done) {
        var errorHandler = errFn.bind(undefined, done), // curries in `done` callback so we don't need to pass it
            refreshToken,
            refreshTokenValue,
            token,
            tokenValue;
        
        RefreshTokenModel.remove(modelData, errorHandler);
        AccessTokenModel.remove(modelData, errorHandler);
        
        tokenValue = crypto.randomBytes(32).toString('base64');
        refreshTokenValue = crypto.randomBytes(32).toString('base64');
        
        modelData.token = tokenValue;
        token = new AccessTokenModel(modelData);
        
        modelData.token = refreshTokenValue;
        refreshToken = new RefreshTokenModel(modelData);
        
        refreshToken.save(errorHandler);
        token.save(function (err) {
            if (err) { return done(err); }
            done(null, tokenValue, refreshTokenValue, { 'expires_in': config.get('security:tokenLife') });
        });
    };
    
    // Exchange username & password for access token.
    server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
            UserModel.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user || !user.checkPassword(password)) {
                    return done(null, false);
                }
                
                var modelData = { userId: user.userId, clientId: client.clientId };
                
                generateTokens(modelData, done);
            });
        }));
    
    // Exchange refreshToken for access token.
    server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
            RefreshTokenModel.findOne({ token: refreshToken, clientId: client.clientId }, function (err, token) {
                if (err) { return done(err); }
                if (!token) { return done(null, false); }
                
                UserModel.findById(token.userId, function (err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    
                    var modelData = { userId: user.userId, clientId: client.clientId };
                    
                    generateTokens(modelData, done);
                });
            });
        }));
    
    
    // token endpoint
    //
    // `token` middleware handles client requests to exchange authorization grants
    // for access tokens.  Based on the grant type being exchanged, the above
    // exchange middleware will be invoked to handle the request.  Clients must
    // authenticate when making requests to this endpoint.
    
    exports.token = [
        passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
        server.token(),
        server.errorHandler()
    ];
    
    exports.isAuthenticated = passport.authenticate('bearer', { session: false });

})();;(function () {
    
    "use strict";
    
    var log = require('../libs/log')(module);
    var UserModel = require('../models/users').UserModel;
    
    // Create endpoint /api/users for POST
    
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
    
    exports.create = create;
    exports.postUsers = function (req, res, next) {
        var result = create(req.body, function (err, user) {
            if (err) {
                next(err);
            }
            else {
                res.json(user);
            }
        });
    };
})();;var nconf = require('nconf');
//
nconf.argv()
    .env()
    .file({ file: './src/config.json' });// relative to application entry

module.exports = nconf;
;var mongoose    = require('mongoose');
var log         = require('../libs/log')(module);
var config      = require('../libs/config');


mongoose.connect(config.get('mongoose:uri'));

//var db = mongoose.connection;

//db.on('error', function (err) {
//    log.error('connection error:', err.message);
//});
//db.once('open', function callback () {
//    log.info("Connected to DB!");
//});

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

module.exports = getLogger;;var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var AccessToken = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports.AccessTokenModel = mongoose.model('AccessToken', AccessToken);;var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Client = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
});

module.exports.ClientModel = mongoose.model('Client', Client);;var mongoose    = require('mongoose');
var Schema = mongoose.Schema;

var RefreshToken = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports.RefreshTokenModel = mongoose.model('RefreshToken', RefreshToken);;var mongoose    = require('mongoose');
var log         = require('../libs/log')(module);
var config      = require('../libs/config');
var crypto      = require('crypto');

var Schema = mongoose.Schema;

var User = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

User.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });

User.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        //more secure - this.salt = crypto.randomBytes(128).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () { return this._plainPassword; });


User.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports.UserModel = mongoose.model('User', User);;var express                 = require('express');
var favicon                 = require('serve-favicon');
var methodOverride          = require('method-override');
var path                    = require('path');
var passport                = require('passport');
var bodyParser              = require('body-parser');
var config                  = require('./libs/config');
var mongoose                = require('./libs/db').mongoose;
var log                     = require('./libs/log')(module);
var oauth2                  = require('./controllers/oauth2');
var authController          = require('./controllers/auth');
var usersController         = require('./controllers/users');
var clientController        = require('./controllers/client');


var app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(methodOverride('X-HTTP-Method-Override'));




if ( (process.env.NODE_ENV === 'test') || (process.env.NODE_ENV === 'dev') ) {
    // Add headers
    app.use(function (req, res, next) {
        // Website you wish to allow to connect
        //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:52432');
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
}


app.use(express.static(path.join(__dirname, "public")));

app.post('/oauth/token', oauth2.token);
app.get('/api', oauth2.isAuthenticated, function (req, res) {
    res.send('API is running');
});
app.get('/api/user',
    oauth2.isAuthenticated,
    function (req, res) {
    res.json({
        user_id: req.user.userId, 
        name: req.user.username, 
        scope: req.authInfo.scope
    });
});
app.post('/api/user', usersController.postUsers);




app.post('/api/client', clientController.postClients);








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


app.listen(config.get('port'), function () {
    log.info('Express server listening on port ' + config.get('port'));
});

























































//app.get('/api/articles', oauth2.isAuthenticated, function (req, res) {
//    return ArticleModel.find(function (err, articles) {
//        if (!err) {
//            return res.send(articles);
//        } else {
//            res.statusCode = 500;
//            log.error('Internal error(%d): %s', res.statusCode, err.message);
//            return res.send({ error: 'Server error' });
//        }
//    });
//});

//app.post('/api/articles', oauth2.isAuthenticated, function (req, res) {
//    var article = new ArticleModel({
//        title: req.body.title,
//        author: req.body.author,
//        description: req.body.description,
//        images: req.body.images
//    });
    
//    article.save(function (err) {
//        if (!err) {
//            log.info("article created");
//            return res.send({ status: 'OK', article: article });
//        } else {
//            console.log(err);
//            if (err.name == 'ValidationError') {
//                res.statusCode = 400;
//                res.send({ error: 'Validation error' });
//            } else {
//                res.statusCode = 500;
//                res.send({ error: 'Server error' });
//            }
//            log.error('Internal error(%d): %s', res.statusCode, err.message);
//        }
//    });
//});

//app.get('/api/articles/:id', oauth2.isAuthenticated, function (req, res) {
//    return ArticleModel.findById(req.params.id, function (err, article) {
//        if (!article) {
//            res.statusCode = 404;
//            return res.send({ error: 'Not found' });
//        }
//        if (!err) {
//            return res.send({ status: 'OK', article: article });
//        } else {
//            res.statusCode = 500;
//            log.error('Internal error(%d): %s', res.statusCode, err.message);
//            return res.send({ error: 'Server error' });
//        }
//    });
//});

//app.put('/api/articles/:id', oauth2.isAuthenticated, function (req, res) {
//    return ArticleModel.findById(req.params.id, function (err, article) {
//        if (!article) {
//            res.statusCode = 404;
//            return res.send({ error: 'Not found' });
//        }
        
//        article.title = req.body.title;
//        article.description = req.body.description;
//        article.author = req.body.author;
//        article.images = req.body.images;
//        return article.save(function (err) {
//            if (!err) {
//                log.info("article updated");
//                return res.send({ status: 'OK', article: article });
//            } else {
//                if (err.name == 'ValidationError') {
//                    res.statusCode = 400;
//                    res.send({ error: 'Validation error' });
//                } else {
//                    res.statusCode = 500;
//                    res.send({ error: 'Server error' });
//                }
//                log.error('Internal error(%d): %s', res.statusCode, err.message);
//            }
//        });
//    });
//});

//app.delete('/api/articles/:id', oauth2.isAuthenticated, function (req, res) {
//    return ArticleModel.findById(req.params.id, function (err, article) {
//        if (!article) {
//            res.statusCode = 404;
//            return res.send({ error: 'Not found' });
//        }
//        return article.remove(function (err) {
//            if (!err) {
//                log.info("article removed");
//                return res.send({ status: 'OK' });
//            } else {
//                res.statusCode = 500;
//                log.error('Internal error(%d): %s', res.statusCode, err.message);
//                return res.send({ error: 'Server error' });
//            }
//        });
//    });
//});


