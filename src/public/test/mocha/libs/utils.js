(function() {

    'use strict';

    /*
     * Modified from https://github.com/elliotf/mocha-mongoose
     */

    //var db = require('../../../../libs/db');
    var config = require('../../../../libs/config');
    var mongoose = require('mongoose');
    var i18n = new(require('i18n-2'))(config.get("i18n"));

    // ensure the NODE_ENV is set to 'test'
    // this is helpful when you would like to change behavior when testing
    process.env.NODE_ENV = 'test';

    before(function(done) {

        global.i18n = i18n;

        done();
    });

    after(function(done) {
        done();
    });

    beforeEach(function(done) {

        function clearDB() {

            mongoose.connection.db.dropDatabase(function(err, result) {
                done();
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