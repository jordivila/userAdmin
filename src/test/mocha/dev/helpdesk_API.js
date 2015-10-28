(function () {
    'use strict';


    var pathToSrc = "./../../../";

    // import the moongoose helper utilities
    var utils = require('./libs/initMochaTests');
    var util = require('util');
    var assert = require("assert");
    var HelpdeskController = require(pathToSrc + 'backend/controllers/helpdesk');
    var helpdeskController = new HelpdeskController();
    var ErrorHandled = require(pathToSrc + 'crossLayer/models/errorHandled');
    var myUtils = require(pathToSrc + 'backend/libs/commonFunctions');
    var _ = require("underscore");
    var helpdeskCrossLayer = require(pathToSrc + 'crossLayer/helpdesk');


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


    describe('Helpdesk API features', function () {

        it('No tests here. API should return the same as mongodb tests', function (done) {

            assert.equal(1, 1, true);

            done();

        });

    });

})();