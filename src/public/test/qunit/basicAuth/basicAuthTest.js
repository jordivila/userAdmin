(function (module) {
    
    'use strict';

    module("Create user Tests");
    
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
    
    var user = {
        email: "some_email" + new Date().toJSON().replace(/\W+/g, '').toLowerCase() + "@domain.com",
        password :"somepassword",
        passwordConfirm: "somepassword"
    };

    test("create user", function () {
        postUser(user, function (data) {
            ok(data.isValid === true, "Expected user created. Instead found not valid result");
            ok(data.userId !== null, "Expected userId value");
            
                jQuery
                    .ajax({
                        url: server.getBaseAddress() + "/api/user/",
                        type: "GET",
                        beforeSend: function (xhr, settings) {
                            xhr.setRequestHeader("Authorization", "Basic " + btoa(user.email + ":" + user.password)); 
                        }
                    })
                    .done(function (dataUserInfo, textStatus, jqXHR) {
                        equal(user.email, dataUserInfo.user.email, "token user match username");
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        ok(false, "Something went wrong getting userinfo");
                    });
        });
    });

})(module);