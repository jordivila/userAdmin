(function () {
    'use strict';


    var pathToSrc = "./../../../";

    // import the moongoose helper utilities
    //var utils = require('./libs/initMochaTests');
    var util = require('util');
    var assert = require("assert");
    //var userController = require(pathToSrc + 'backend/controllers/users');
    //var roleController = require(pathToSrc + 'backend/controllers/usersRoles');
    //var authController = require(pathToSrc + 'backend/controllers/auth');
    //var ErrorHandled = require(pathToSrc + 'backend/models/errorHandled');
    var config = require(pathToSrc + 'backend/libs/config');
    var mailingController = require(pathToSrc + 'backend/controllers/mailing');
    var mongoose = require('mongoose');
    
    
    describe('Services', function () {

        describe('Mongolab Services', function () {

            it('is alive', function (done) {

                console.log(config.get('mongoose:uri'));
                console.log(config.get('NODE_ENV'));

                if (mongoose.connection.readyState === 0) {

                    mongoose.connect(config.get('mongoose:uri'), function (err) {
                        if (err) {
                            if (err !== null)
                            {
                                console.error(err);
                            }

                            assert.equal(err, null, "No error expected using email services");
                            done();
                        }

                        mongoose.disconnect();
                        done();
                        //return clearDB();

                    });
                } else {
                    mongoose.disconnect();
                    done();
                }
            });
        });

        
        //describe('Email Services', function () {
            
        //    it('is alive', function (done) {
        //        mailingController.testEmail(global, function (err, createdUser) {
        //            if (err !== null)
        //            {
        //                console.log(err);
        //            }
        //            assert.equal(err, null, "No error expected using email services");
        //            //assert.equal(err instanceof ErrorHandled, true, "error should be instanceOf ErrorHandled");
        //            //assert.equal(resultHasMessage(i18n.__("DataAnnotations.EmailNotValid"), err.details), true);
        //            done();
        //        });
        //    });
            
        //});
        
    });
})();