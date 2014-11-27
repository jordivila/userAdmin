var express                 = require('express');
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


var app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(methodOverride('X-HTTP-Method-Override'));




mongoose.connect(config.get('mongoose:uri'), function (err) {
    if (err) {
        throw err;
    }
});





if (process.env.NODE_ENV == 'test') {
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

app.get('/ErrorExample', function (req, res, next) {
    next(new Error('Random error!'));
});


app.use(function (req, res, next) {
    res.status(404);
    log.debug('Not found URL: %s', req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('Internal error(%d): %s', res.statusCode, err.message);
    res.send({ error: err.message });
    return;
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


