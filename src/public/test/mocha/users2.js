(function() {
    'use strict';
    // import the moongoose helper utilities
    var utils = require('./libs/utils');
    var assert = require("assert");
    var userController = require('../../../controllers/users');
    var roleController = require('../../../controllers/roles');
    var ErrorHandled = require('../../../models/errorHandled');


    describe('Users', function() {
        describe('Register process', function() {


            var UserNameValid = new Date().toJSON().replace(/\W+/g, '').toLowerCase();
            var UserEmailValid = UserNameValid + "@valid.com";
            var UserPassword = "123456";
            var UserNameValidActivationToken; //Guid
            var CantAccessMyAccountToken; //Guid
            var UserNameValidUnActivated = new Date().toJSON().replace(/\W+/g, '').toLowerCase(); //Guid.NewGuid().ToString();
            var UserEmailValidUnActivated = UserNameValidUnActivated + "@valid.com";



            function initUser(email, password, passwordConfirm) {
                return {
                    email: email,
                    password: password,
                    passwordConfirm: passwordConfirm
                };
            }

            function resultHasMessage(messageToSearch, keyValueArray) {
                for (var j = 0; j < keyValueArray.length; j++) {
                    for (var i in keyValueArray[j]) {
                        if (keyValueArray[j][i] == messageToSearch) {
                            return true;
                        }
                    }
                }
                return false;
            }


            it('no invalid emails allowed', function(done) {
                userController.create(initUser("invalidEmail", "123456", "123456"), i18n, function(err, createdUser) {
                    assert.equal(err, null, err === null ? '' : err.message);
                    assert.equal(createdUser.isValid, false);
                    assert.equal(resultHasMessage(i18n.__("Invalid email address"), createdUser.messages), true);
                    done();
                });
            });

            it('no invalid passwords allowed', function(done) {
                userController.create(initUser(UserEmailValid, "    ", "    "), i18n, function(err, createdUser) {
                    assert.equal(err, null, err === null ? '' : err.message);
                    assert.equal(createdUser.isValid, false);
                    assert.equal(resultHasMessage(i18n.__("Invalid password"), createdUser.messages), true);
                    done();
                });
            });

            it('password and password confirmation match', function(done) {
                userController.create(initUser(UserEmailValid, "123456", "1234567"), i18n, function(err, createdUser) {
                    assert.equal(err, null, err === null ? '' : err.message);
                    assert.equal(createdUser.isValid, false);
                    assert.equal(resultHasMessage(i18n.__("Password and confirmation do not match"), createdUser.messages), true);
                    done();
                });
            });

            it('register unactivated account succeeds', function(done) {

                var newRole = {
                    name: "Guest"
                };

                roleController.create(newRole, i18n, function(errRole, roleCreated) {
                    assert.equal(errRole, null, errRole === null ? '' : errRole.message);

                    userController.create(initUser(UserEmailValid, UserPassword, UserPassword), i18n, function(err, createdUser) {
                        assert.equal(err, null, err === null ? '' : err.message);
                        assert.equal(createdUser.isValid, true);
                        assert.equal(resultHasMessage(i18n.__("User created"), createdUser.messages), true);
                        done();
                    });
                });
            });

            it('register duplicated not allowed', function(done) {
                var newRole = {
                    name: "Guest"
                };

                roleController.create(newRole, i18n, function(errRole, roleCreated) {
                    assert.equal(errRole, null, errRole === null ? '' : errRole.message);

                    userController.create(initUser(UserEmailValid, UserPassword, UserPassword), i18n, function(err, createdUser) {
                        assert.equal(err, null, err === null ? '' : err.message);
                        assert.equal(createdUser.isValid, true);
                        assert.equal(resultHasMessage(i18n.__("User created"), createdUser.messages), true);

                        userController.create(initUser(UserEmailValid, UserPassword, UserPassword), i18n, function(err, createdUser) {
                            assert.equal(err instanceof ErrorHandled, true, "error should be instanceOf ErrorHandled");
                            assert.equal(err.message, i18n.__("User already exists"), "error should be '" + i18n.__("User already exists") + "'");
                            done();
                        });
                    });
                });
            });


            it('activating account with invalid token not allowed', function(done) {
                var newRole = {
                    name: "Guest"
                };

                roleController.create(newRole, i18n, function(errRole, roleCreated) {
                    assert.equal(errRole, null, errRole === null ? '' : errRole.message);

                    userController.create(initUser(UserEmailValid, UserPassword, UserPassword), i18n, function(err, createdUser) {
                        assert.equal(err, null, err === null ? '' : err.message);
                        assert.equal(createdUser.isValid, true);
                        assert.equal(resultHasMessage(i18n.__("User created"), createdUser.messages), true);


                        userController.confirmEmail(createdUser.data.tokenId, i18n, function(err, confirmResult) {
                            assert.equal(err, null, err === null ? '' : err.message);
                            assert.equal(createdUser.isValid, true);
                            assert.equal(resultHasMessage(i18n.__("User email confirmed"), confirmResult.messages), true);
                            done();
                        });
                    });
                });
            });

            /*

            it('activate account succeeds', function(done) {
                assert.equal(false, true);
                done();
            });
            */

        });
    });
})();