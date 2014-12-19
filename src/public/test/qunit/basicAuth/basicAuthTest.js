(function (QUnit) {
    
    'use strict';
    
    jQuery(document)
        .ajaxSend(function (e, x, settings) {
        stop();
    })
        .ajaxComplete(function (e, x, settings) {
        start();
    });
    

    
    
    
    var userGenerate = function () {
        
        return {
            email: "some_email" + new Date().toJSON().replace(/\W+/g, '').toLowerCase() + "@domain.com",
            password: "somepassword",
            passwordConfirm: "somepassword"
        };
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
    
    
    module("User account tests");

    test("Register, confirm and login", function () {
        
        var user = userGenerate();
        
        postUser(user, function (register) {
            console.log(register);
            ok(register.isValid === true, "Users can register credentials");
            ok(register.data.userId !== null, "User credentials generate userId");
            ok(register.data.tokenId !== null, "User credentials tokenId sent via email");
            
            //  
            jQuery.get(server.getBaseAddress() + "/api/users/confirmation/" + register.data.tokenId)
            .done(function (confirmation, textStatus, jqXHR) {
                ok(confirmation.isValid === true, "Users can confirm by token");
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ok(false, "Unhandled error creating user. TextStatus->" + textStatus + " / errorThrown->" + errorThrown);
            });

        });
    });
    
    //test("user authentication", function () {
        
    //    var user = userGenerate();
        
    //    postUser(user, function (data) {
    //        ok(data.isValid === true, "Users can create login credentials");
            
    //        jQuery
    //            .ajax({
    //            url: server.getBaseAddress() + "/api/user/",
    //            type: "GET",
    //            beforeSend: function (xhr, settings) {
    //                xhr.setRequestHeader("Authorization", "Basic " + btoa(user.email + ":" + user.password));
    //            }
    //        })
    //            .done(function (dataUserInfo, textStatus, jqXHR) {
    //            equal(user.email, dataUserInfo.email, "token user match username");
    //        })
    //            .fail(function (jqXHR, textStatus, errorThrown) {
    //            ok(false, "Something went wrong getting userinfo");
    //        });
    //    });
    //});

})(QUnit);