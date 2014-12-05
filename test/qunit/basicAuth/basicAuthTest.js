    
    module("Auth Tests");
    
    jQuery(document)
        .ajaxSend(function (e, x, settings) {
            stop();
        })
        .ajaxComplete(function (e, x, settings) {
            start();
        });
    
    
    var postUser = function (userCredentials, callback) {
        
        jQuery.post(server.getBaseAddress() + "/api/user/", userCredentials)
            .done(function (data, textStatus, jqXHR) {
                callback(data);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ok(false, "Unhandled error creating user. TextStatus->" + textStatus + " / errorThrown->" + errorThrown);
            });
    };
    
    var getRandomUser = function () {
        return {
            username: getRandomString(10),
            password: getRandomString(9)
        };
    };
    
    
    var newUser = getRandomUser();
    
    test("create user", function () {
        postUser(newUser, function (data) {
            ok(data.isValid === true, "Expected user created. Instead found not valid result");
            ok(data.userId !== null, "Expected userId value");
            
            postUser(newUser, function (dataUserAlreadyExists) {
                ok(dataUserAlreadyExists.isValid === false, "Expected not valid result");
            });
        });
    });

    //test("valid token get valid user info", function () {
        
    //    getValidToken(getTokenCredentials(newUser, newClient), function (dataTokenCreated) {
            
    //        jQuery
    //            .ajax({
    //                url: server.getBaseAddress() + "/api/user/",
    //                type: "GET",
    //                beforeSend: function (xhr, settings) {
    //                    xhr.setRequestHeader("Authorization", dataTokenCreated.token_type + " " + dataTokenCreated.access_token);
    //                }
    //            })
    //            .done(function (dataUserInfo, textStatus, jqXHR) {
    //                equal(newUser.username, dataUserInfo.name, "token user match username");
    //            })
    //            .fail(function (jqXHR, textStatus, errorThrown) {
    //                ok(false, "Something went wrong getting userinfo");
    //            });
    //    });
    //});

