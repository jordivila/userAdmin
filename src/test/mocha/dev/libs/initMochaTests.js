(function () {

    'use strict';

    var pathToSrc = "./../../../../";

    var config = require(pathToSrc + 'backend/libs/config');
    var mongoose = require('mongoose');
    var i18n = new (require('i18n-2'))(config.get("i18n"));
    var assert = require("assert");
    var commonController = require(pathToSrc + 'backend/controllers/tests');


    before(function (done) {

        global.i18n = i18n;

        done();
    });

    after(function (done) {
        done();
    });

    beforeEach(function (done) {

        commonController.initDb(global, function (err, roleCreated) {
            if (err)
            {
                assert.equal(err, null, err === null ? '' : err.message);
            }

            return done();
        });

    });

    afterEach(function (done) {
        mongoose.disconnect();
        done();
    });

})();