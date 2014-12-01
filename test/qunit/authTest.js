(function (module) {
    
    'use strict';
    
    module("Auth Tests");
    
    
    var server = {
        name : "localhost",
        port : 1337,
        getBaseAddress: function () {
            return "http://" + this.name + ":" + this.port;
        }
    };
    
    
    jQuery(document)
    .ajaxSend(function (e, x, settings) {
            stop();
        })
    .ajaxComplete(function (e, x, settings) {
            start();
        });
    
    var getClientData = function (user) {
        
        return {
            name: getRandomString(15), 
            clientId: getRandomString(10),
            clientSecret: getRandomString(10)
        };

    };
    var getTokenCredentials = function (user, clientData) {
        
        return {
            grant_type: "password",
            client_id: clientData.clientId,
            client_secret: clientData.clientSecret,
            username: user.username,
            password: user.password
        };

    };
    var getValidToken = function (tokenCredentials, callback) {
        
        jQuery.post(server.getBaseAddress() + "/oauth/token/", tokenCredentials)
        .done(function (data, textStatus, jqXHR) {
                ok(data.access_token !== null, "Response has access_token");
                ok(data.refresh_token !== null, "Response has refresh_token");
                ok(data.expires_in !== null, "Response has expires_in value");
                ok(data.token_type !== null, "Response has token_type value");
                callback(data);
            })
        .fail(function (jqXHR, textStatus, errorThrown) {
                ok(false, "Something wrong getting token. TextStatus->" + textStatus + " / errorThrown->" + errorThrown);
            });
    };
    var postClient = function (clientData, callback) {
        
        jQuery.post(server.getBaseAddress() + "/api/client/", clientData)
            .done(function (data, textStatus, jqXHR) {
                callback(data);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ok(false, "Unhandled error creating client. TextStatus->" + textStatus + " / errorThrown->" + errorThrown);
            });
    };
    var postUser = function (userCredentials, callback) {
        
        jQuery.post(server.getBaseAddress() + "/api/user/", userCredentials)
            .done(function (data, textStatus, jqXHR) {
                callback(data);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ok(false, "Unhandled error creating user. TextStatus->" + textStatus + " / errorThrown->" + errorThrown);
            });
    };
    var getRandomString = function (stringLength) {
        var s = "";
        while (s.length < stringLength && stringLength > 0) {
            var r = Math.random();
            s += (r < 0.1?Math.floor(r * 100):String.fromCharCode(Math.floor(r * 26) + (r > 0.5?97:65)));
        }
        return s;
    };
    var getRandomUser = function () {
        return {
            username: getRandomString(10),
            password: getRandomString(9)
        };
    };
    
    
    var newClient = getClientData();
    var newUser = getRandomUser();
    
    test("create client", function () {
        postClient(newClient, function (data) {
            ok(data.isValid === true, "Expected client created. Instead found not valid result");
            ok(data.clientId !== null, "Expected clientId value");
        });
    });

    
    test("create user", function () {
        postUser(newUser, function (data) {
            ok(data.isValid === true, "Expected user created. Instead found not valid result");
            ok(data.userId !== null, "Expected userId value");
            
            postUser(newUser, function (dataUserAlreadyExists) {
                ok(dataUserAlreadyExists.isValid === false, "Expected not valid result");
            });
        });
    });

    test("valid credentials get valid token", function () {
        getValidToken(getTokenCredentials(newUser, newClient), function (data) {
        
        });
    });

    test("valid token get valid user info", function () {
        
        getValidToken(getTokenCredentials(newUser, newClient), function (dataTokenCreated) {
            
            jQuery
                .ajax({
                    url: server.getBaseAddress() + "/api/user/",
                    type: "GET",
                    beforeSend: function (xhr, settings) {
                        xhr.setRequestHeader("Authorization", dataTokenCreated.token_type + " " + dataTokenCreated.access_token);
                    }
                })
                .done(function (dataUserInfo, textStatus, jqXHR) {
                    equal(newUser.username, dataUserInfo.name, "token user match username");
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    ok(false, "Something went wrong getting userinfo");
                });
        });
    });

    




})(module);