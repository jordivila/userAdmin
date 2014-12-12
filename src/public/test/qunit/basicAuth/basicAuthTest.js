(function(module) {

    'use strict';

    module("User Tests");

    jQuery(document)
        .ajaxSend(function(e, x, settings) {
            stop();
        })
        .ajaxComplete(function(e, x, settings) {
            start();
        });

    var userGenerate = function() {

        return {
            email: "some_email" + new Date().toJSON().replace(/\W+/g, '').toLowerCase() + "@domain.com",
            password: "somepassword",
            passwordConfirm: "somepassword"
        };
    };

    var postUser = function(userCredentials, callback) {

        jQuery.post(server.getBaseAddress() + "/api/user/", userCredentials)
            .done(function(data, textStatus, jqXHR) {
                callback(data);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                ok(false, "Unhandled error creating user. TextStatus->" + textStatus + " / errorThrown->" + errorThrown);
            });
    };


    test("user creation", function() {

        var user = userGenerate();

        postUser(user, function(data) {
            ok(data.isValid === true, "Users can create login credentials");
            ok(data.userId !== null, "Users credentials generate userId");
        });
    });

    test("user authentication", function() {

        var user = userGenerate();

        postUser(user, function(data) {
            ok(data.isValid === true, "Users can create login credentials");

            jQuery
                .ajax({
                    url: server.getBaseAddress() + "/api/user/",
                    type: "GET",
                    beforeSend: function(xhr, settings) {
                        xhr.setRequestHeader("Authorization", "Basic " + btoa(user.email + ":" + user.password));
                    }
                })
                .done(function(dataUserInfo, textStatus, jqXHR) {
                    equal(user.email, dataUserInfo.email, "token user match username");
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    ok(false, "Something went wrong getting userinfo");
                });
        });
    });

})(module);