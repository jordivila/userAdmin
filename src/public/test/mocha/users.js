(function () {
    'use strict';
    // import the moongoose helper utilities
    var utils = require('./libs/utils');
    var assert = require("assert");
    var userController = require('../../../controllers/users'); 
    

    describe('Users: models', function () {
        describe('#create()', function () {

            // Create a User object to pass to User.create()
            var u = {
                email: null, //faker.name.firstName().toLowerCase(),
                password: null, //faker.lorem.words(1)[0],
                passwordConfirm: null
            };

            it('should fail when no valid user is set', function (done) {
                userController.create(u, i18n, function (err, createdUser) {
                    assert.equal(err, null);
                    assert.equal(createdUser.isValid, false);
                    done();
                });
            });

            it('should fail creating duplicated user', function (done) {

                u.email = "valid@emailaddress.com";
                u.password = "validpassword";
                u.passwordConfirm = u.password;

                userController.create(u, i18n, function (err, createdUser) {
                    
                    userController.create(u, i18n,  function (err, repeatedUser) {
                        assert.equal(err, null);
                        assert.equal(repeatedUser.isValid, false);
                        assert.equal(repeatedUser.userId, null);
                        done();
                    });
                });
            });
            
        });
    });
})();