(function (QUnit) {
    
    'use strict';
    
    
    var userGenerate = function () {
        
        return {
            email: "some_email" + new Date().toJSON().replace(/\W+/g, '').toLowerCase() + "@domain.com",
            password: "somepassword",
            passwordConfirm: "somepassword"
        };
    };
    var userRegister = function (userCredentials, callback) {
        
        jQuery.post(server.getBaseAddress() + "/api/user/", userCredentials)
            .done(function (data, textStatus, jqXHR) {
                callback(data);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ok(false, "Unhandled error creating user. TextStatus->" + textStatus + " / errorThrown->" + errorThrown);
            });
    };
    var userConfirmEmail = function (token, callback) {
        jQuery.get(server.getBaseAddress() + "/api/users/confirmation/" + token)
            .done(function (confirmation, textStatus, jqXHR) {
                callback(confirmation);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                ok(false, "Unhandled error confirming user email. TextStatus->" + textStatus + " / errorThrown->" + errorThrown);
            });
    };
    
    
    module("User account tests");
    
    test("Register, confirm and login", function () {
        
        var user = userGenerate();
        
        userRegister(user, function (register) {
            ok(register.isValid === true, "Users can register credentials");
            ok(register.data.userId !== null, "User credentials generate userId");
            ok(register.data.tokenId !== null, "User credentials tokenId sent via email");
            
            //  
            userConfirmEmail(register.data.tokenId, function (confirmation) {
                ok(confirmation.isValid === true, "Users can confirm by token");

            });
        });
    });
    
    //test("user authentication", function () {
        
    //    var user = userGenerate();
        
    //    userRegister(user, function (data) {
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