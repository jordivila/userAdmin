(function () {
    
    'use strict';
    
    
    // import the moongoose helper utilities
    var utils = require('./libs/utils');
    var assert = require("assert");
    var faker = require('Faker');

    // import our User mongoose model
    var userController = require('../../src/controllers/users');
    
    describe('Users: models', function () {
        
        describe('#create()', function () {
            
            // Create a User object to pass to User.create()
            var u = {
                username: faker.name.firstName().toLowerCase(),
                password: faker.lorem.words(1)[0]
            };


            it('should create a new User', function (done) {
                userController.create(u, function (err, createdUser) {
                    assert.equal(err, null);
                    assert.equal(createdUser.isValid, true);
                    assert.notEqual(createdUser.userId, null);

                    done();
                });
            });

            it('should fail creating duplicated user', function (done) {

                userController.create(u, function (err, createdUser) {
                    
                    userController.create(u, function (err, repeatedUser) {
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