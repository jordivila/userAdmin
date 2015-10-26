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

    describe('Helpdesk Employees API features', function () {

        this.timeout(15000);

        it('Import all customers', function (done) {
            
            helpdeskController.importAll(1000000,function (e, importData) {

                if (e) throw e;

                console.log();

                done();
            });

        });

    });

})();