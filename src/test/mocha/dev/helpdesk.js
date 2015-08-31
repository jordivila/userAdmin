(function () {
    'use strict';


    var pathToSrc = "./../../../";

    // import the moongoose helper utilities
    var utils = require('./libs/initMochaTests');
    var util = require('util');
    var assert = require("assert");
    var helpdeskController = require(pathToSrc + 'backend/controllers/helpdesk');
    var ErrorHandled = require(pathToSrc + 'crossLayer/models/errorHandled');
    var myUtils = require(pathToSrc + 'backend/libs/commonFunctions');


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

    describe('Helpdesk', function () {

        describe('Customers features', function () {

            it('Customer can add a talk', function (done) {

                //var req = myUtils.extendDeep({}, global);

                //req.user = {
                //    isEmployee: false
                //};

                //req.cookies = [
                //    { customerId: 1 }
                //];

                //var filter = {
                //    filter: {},
                //    page: 0,
                //    pageSize: 50,
                //    sortAscending: false,
                //    sortBy: ""
                //};


                helpdeskController.testMethodInitDb(function (e, initDbData) {

                    if (e) {
                        throw e;
                    }
                    else {


                        var req = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);



                        helpdeskController.talkAdd
                            (req,
                            {
                                subject: "nueva conversacion de test"
                            },
                            function (err, addResult) {

                                console.log("addResult");
                                console.log(addResult);

                                assert.equal(err, null, err === null ? '' : err.message);
                                assert.equal(addResult.isValid, true);
                                //assert.equal(resultHasMessage(i18n.__("AccountResources.CreateNewAccount_EmailSent"), searchResult.messages), true);

                                done();

                            });
                    }


                });

            });

        });

    });
})();