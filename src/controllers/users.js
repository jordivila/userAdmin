(function (module) {
    
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

    
    

})(module);