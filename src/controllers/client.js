(function () {
    
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
})();