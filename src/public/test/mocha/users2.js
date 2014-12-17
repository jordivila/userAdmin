(function() {
    'use strict';
    // import the moongoose helper utilities
    var utils = require('./libs/initMochaTests');
    var util = require('util');
    var assert = require("assert");
    var userController = require('../../../controllers/users');
    var roleController = require('../../../controllers/roles');
    var ErrorHandled = require('../../../models/errorHandled');


    describe('User\'s account', function() {

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


        describe('Register process', function() {

            it('no invalid emails allowed', function(done) {
                userController.create(global, initUser("invalidEmail", "123456", "123456"), function(err, createdUser) {
                    assert.equal(err instanceof ErrorHandled, true, "error should be instanceOf ErrorHandled");
                    assert.equal(resultHasMessage(i18n.__("DataAnnotations.EmailNotValid"), err.details), true);
                    done();
                });
            });

            it('no invalid passwords allowed', function(done) {
                userController.create(global, initUser(UserEmailValid, "    ", "    "), function(err, createdUser) {
                    assert.equal(err instanceof ErrorHandled, true, "error should be instanceOf ErrorHandled");
                    assert.equal(resultHasMessage(i18n.__("AccountResources.InvalidPassword"), err.details), true);
                    done();
                });
            });

            it('password and password confirmation match', function(done) {
                userController.create(global, initUser(UserEmailValid, "123456", "1234567"), function(err, createdUser) {
                    assert.equal(err instanceof ErrorHandled, true, "error should be instanceOf ErrorHandled");
                    assert.equal(resultHasMessage(i18n.__("AccountResources.NewPasswordConfirmError"), err.details), true);
                    done();
                });
            });

            it('register unactivated account succeeds', function(done) {
                userController.create(global, initUser(UserEmailValid, UserPassword, UserPassword), function(err, createdUser) {
                    assert.equal(err, null, err === null ? '' : err.message);
                    assert.equal(createdUser.isValid, true);
                    assert.equal(resultHasMessage(i18n.__("User created"), createdUser.messages), true);
                    done();
                });
            });

            it('register duplicated not allowed', function(done) {
                userController.create(global, initUser(UserEmailValid, UserPassword, UserPassword), function(err, createdUser) {
                    assert.equal(err, null, err === null ? '' : err.message);
                    assert.equal(createdUser.isValid, true);
                    assert.equal(resultHasMessage(i18n.__("User created"), createdUser.messages), true);

                    userController.create(global, initUser(UserEmailValid, UserPassword, UserPassword), function(err, createdUser) {
                        assert.equal(err instanceof ErrorHandled, true, "error should be instanceOf ErrorHandled");
                        assert.equal(err.message, i18n.__("User already exists"));
                        done();
                    });
                });
            });
        });



        describe('Confirm email address', function() {

            it('confirm user email with valid token suceeds', function(done) {
                userController.create(global, initUser(UserEmailValid, UserPassword, UserPassword), function(err, createdUser) {
                    assert.equal(err, null, err === null ? '' : err.message);
                    assert.equal(createdUser.isValid, true);
                    assert.equal(resultHasMessage(i18n.__("User created"), createdUser.messages), true);


                    userController.confirmEmail(global, createdUser.data.tokenId, function(err, confirmResult) {
                        assert.equal(err, null, err === null ? '' : err.message);
                        assert.equal(createdUser.isValid, true);
                        assert.equal(resultHasMessage(i18n.__("User email confirmed"), confirmResult.messages), true);
                        done();
                    });
                });
            });

            it('confirm user email with invalid token not allowed', function(done) {
                userController.confirmEmail(global, 'unexistingTokenId', function(err, confirmResult) {
                    assert.equal(err instanceof ErrorHandled, true, "error should be instanceOf ErrorHandled");
                    assert.equal(err.message, i18n.__("Token no exists or token expired"));
                    done();
                });
            });
        });

        describe('Can\'t access your account', function() {

            it('unexisting email address rises error', function(done) {

                userController.cantAccessYourAccount(global, {
                    activateFormVirtualPath: '/appVirtualPath/',
                    email: 'unexisting@email.com'
                }, function(err, cantAccessResult) {
                    assert.equal(err instanceof ErrorHandled, true, "error should be instanceOf ErrorHandled");
                    assert.equal(err.message, i18n.__("User not found"));
                    done();
                });
            });

            it('existing email address gets token from cantAccessYourAccount', function(done) {


                var userToCreate = initUser(UserEmailValid, UserPassword, UserPassword);

                userController.create(global, userToCreate, function(err, createdUser) {
                    assert.equal(err, null, err === null ? '' : err.message);
                    assert.equal(createdUser.isValid, true);
                    assert.equal(resultHasMessage(i18n.__("User created"), createdUser.messages), true);

                    userController.cantAccessYourAccount(global, {
                        activateFormVirtualPath: '/appVirtualPath/',
                        email: userToCreate.email
                    }, function(err, cantAccessResult) {
                        assert.equal(err, null, err === null ? '' : err.message);
                        assert.equal(cantAccessResult.isValid, true);
                        assert.equal(resultHasMessage(i18n.__("An email was sent to the email address provided"), cantAccessResult.messages), true);
                        done();
                    });

                });

            });
        });


        describe('Reset password', function() {

            it('strength password is checked', function(done) {
                userController.resetPassword(global, {
                    token: '  ',
                    newPassword: '  ',
                    confirmNewPassword: ''
                }, function(err, result) {
                    assert.equal(err instanceof ErrorHandled, true, "error should be instanceOf ErrorHandled");
                    assert.equal(err.message, i18n.__("AccountResources.InvalidPassword"));
                    done();
                });
            });

            it('invalid confirmation password is not allowed', function(done) {
                userController.resetPassword(global, {
                    token: '  ',
                    newPassword: '123456',
                    confirmNewPassword: ''
                }, function(err, result) {
                    assert.equal(err instanceof ErrorHandled, true, "error should be instanceOf ErrorHandled");
                    assert.equal(err.message, i18n.__("AccountResources.NewPasswordConfirmError"));
                    done();
                });
            });

            it('invalid token is not allowed', function(done) {
                userController.resetPassword(global, {
                    token: 'une3xistin6token',
                    newPassword: '123456',
                    confirmNewPassword: '123456'
                }, function(err, result) {
                    assert.equal(err instanceof ErrorHandled, true, "error should be instanceOf ErrorHandled");
                    assert.equal(err.message, i18n.__("AccountResources.CantAccessYourAccount_TokenExpired"));
                    done();
                });
            });

            it('reset password succeed', function(done) {

                var userToCreate = initUser(UserEmailValid, UserPassword, UserPassword);

                userController.create(global, userToCreate, function(err, createdUser) {
                    assert.equal(err, null, err === null ? '' : err.message);

                    userController.cantAccessYourAccount(global, {
                        activateFormVirtualPath: '/appVirtualPath/',
                        email: userToCreate.email
                    }, function(err, cantAccessResult) {
                        assert.equal(err, null, err === null ? '' : err.message);

                        userController.resetPassword(global, {
                            token: cantAccessResult.data.tokenId,
                            newPassword: '123456',
                            confirmNewPassword: '123456'
                        }, function(err, result) {
                            assert.equal(err, null, err === null ? '' : err.message);
                            assert.equal(cantAccessResult.isValid, true);
                            assert.equal(resultHasMessage(i18n.__("AccountResources.CantAccessYourAccount_PasswordChanged"), result.messages), true);
                            done();
                        });
                    });
                });
            });
        });



    });
})();