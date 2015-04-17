(function() {

    'use strict';


    // set test environment before anything else
    // this way config will load testing environment variables
    process.env.NODE_ENV = 'test';

    var pathToSrc = "./../../../";

    var config = require(pathToSrc + 'backend/libs/config');
    var mongoose = require('mongoose');
    var i18n = new(require('i18n-2'))(config.get("i18n"));
    var roleController = require(pathToSrc + 'backend/controllers/usersRoles');
    var assert = require("assert");
    var ErrorHandled = require(pathToSrc + 'backend/models/errorHandled');


    

    before(function(done) {

        global.i18n = i18n;

        done();
    });

    after(function(done) {
        done();
    });

    beforeEach(function(done) {

        function createRoleGuest() {

            var newRole = {
                name: "Guest"
            };

            roleController.create(newRole, i18n, function(errRole, roleCreated) {
                assert.equal(errRole, null, errRole === null ? '' : errRole.message);
                done();
            });


        }

        function clearDB() {

            mongoose.connection.db.dropDatabase(function(err, result) {
                createRoleGuest();
            });
        }

        if (mongoose.connection.readyState === 0) {

            mongoose.connect(config.get('mongoose:uri'), function(err) {
                if (err) {
                    throw err;
                }
                return clearDB();
            });
        } else {
            return clearDB();
        }


    });

    afterEach(function(done) {
        mongoose.disconnect();
        done();
    });

})();