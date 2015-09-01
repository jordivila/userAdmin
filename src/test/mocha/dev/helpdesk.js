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

    describe('Helpdesk Customers features', function () {

        it('Customer can add a talk', function (done) {

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

                            assert.equal(err, null, err === null ? '' : err.message);
                            assert.equal(addResult.isValid, true);
                            assert.equal(resultHasMessage(i18n.__("Helpdesk.Talks.Subject.NewSubjectAdded"), addResult.messages), true);

                            done();

                        });
                }
            });
        });

        it('Customers can find their talks', function (done) {

            //var req = myUtils.extendDeep({}, global);

            //req.user = {
            //    isEmployee: false
            //};

            //req.cookies = [
            //    { customerId: 1 }
            //];

            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };


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

                            helpdeskController.talkSearch
                                (req,
                                filter,
                                function (err, searchResult) {

                                    assert.equal(err, null, err === null ? '' : err.message);
                                    assert.equal(searchResult.isValid, true);
                                    assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                    //assert.equal(resultHasMessage(i18n.__("Helpdesk.Talks.Subject.NewSubjectAdded"), searchResult.messages), true);

                                    done();

                                });



                        });
                }


            });

        });


        it('Customers can add messages to their talks', function (done) {

            //var req = myUtils.extendDeep({}, global);

            //req.user = {
            //    isEmployee: false
            //};

            //req.cookies = [
            //    { customerId: 1 }
            //];

            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };


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

                            helpdeskController.messageAdd
                                (req,
                                {
                                    idTalk: addResult.data.editData.idTalk,
                                    message: 'hola esto es un mensaje de prueba'
                                },
                                function (err, messageAddResult) {

                                    //console.log("messageAddResultmessageAddResultmessageAddResultmessageAddResultmessageAddResultmessageAddResultmessageAddResultmessageAddResultmessageAddResult \n");
                                    //console.log(messageAddResult);

                                    assert.equal(err, null, err === null ? '' : err.message);
                                    assert.equal(messageAddResult.isValid, true);
                                    //assert.equal(messageAddResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                    //assert.equal(resultHasMessage(i18n.__("Helpdesk.Talks.Subject.NewSubjectAdded"), searchResult.messages), true);

                                    done();

                                });



                        });
                }


            });

        });

        it('Customers can Get all messages from their talks', function (done) {

            //var req = myUtils.extendDeep({}, global);

            //req.user = {
            //    isEmployee: false
            //};

            //req.cookies = [
            //    { customerId: 1 }
            //];

            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };


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

                            helpdeskController.messageAdd
                                (req,
                                {
                                    idTalk: addResult.data.editData.idTalk,
                                    message: 'hola esto es un mensaje de prueba'
                                },
                                function (err, messageAddResult) {

                                    filter.filter.idTalk = addResult.data.editData.idTalk;

                                    helpdeskController.messageGetAll
                                        (req,
                                        filter,
                                        function (err, messagesAll) {


                                            assert.equal(err, null, err === null ? '' : err.message);
                                            assert.equal(messagesAll.isValid, true);

                                            assert.equal(messagesAll.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                            assert.equal(messagesAll.data.data[0].idTalk === messageAddResult.data.idTalk, true);
                                            assert.equal(messagesAll.data.data[0].idMessage === messageAddResult.data.idMessage, true);
                                            assert.equal(messagesAll.data.data[0].whoPosted.name === req.user.name, true);
                                            assert.equal(messagesAll.data.data[0].whoPosted.isEmployee === req.user.isEmployee, true);

                                            done();

                                        });
                                });
                        });
                }
            });

        });

    });
})();