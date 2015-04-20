(function () {

    'use strict';


    // set test environment before anything else
    // this way config will load testing environment variables
    process.env.NODE_ENV = 'test';

    var pathToSrc = "./../../../";

    var config = require(pathToSrc + 'backend/libs/config');
    var mongoose = require('mongoose');
    var i18n = new (require('i18n-2'))(config.get("i18n"));
    var roleController = require(pathToSrc + 'backend/controllers/usersRoles');
    var assert = require("assert");
    var ErrorHandled = require(pathToSrc + 'backend/models/errorHandled');






    before(function (done) {

        global.i18n = i18n;

        done();
    });

    after(function (done) {
        done();
    });

    beforeEach(function (done) {

        function createRoleGuest() {

            var newRole = {
                name: "Guest"
            };

            roleController.create(newRole, i18n, function (errRole, roleCreated) {
                assert.equal(errRole, null, errRole === null ? '' : errRole.message);
                done();
            });


        }

        function clearDB() {

            // I tested few ways of doing the same thing

            // 1.- This one is the slowest one (in execution time). 
            //     But needs no maintenance 

            //mongoose.connection.db.dropDatabase(function(err, result) {
            //    createRoleGuest();
            //});

            // 2.- This one is faster than the fiorst one (in execution time). 
            //     Removes all documents in all collections in db 


            var modelsInDb = mongoose.connection.modelNames();
            var modelCounter = 0;
            var modelRemoveTrack = null;
            modelRemoveTrack = function (err, rowsAffected) {

                if (err) {
                    console.error(err);
                }

                modelCounter++;

                if (modelCounter < modelsInDb.length) {
                    mongoose.connection.model(modelsInDb[modelCounter]).remove(modelRemoveTrack);
                }
                else {
                    createRoleGuest();
                }
            };

            mongoose.connection.model(modelsInDb[modelCounter]).remove(modelRemoveTrack);
        }

        if (mongoose.connection.readyState === 0) {

            mongoose.connect(config.get('mongoose:uri'), function (err) {
                if (err) {
                    throw err;
                }
                return clearDB();
            });
        } else {
            return clearDB();
        }


    });

    afterEach(function (done) {
        mongoose.disconnect();
        done();
    });

})();