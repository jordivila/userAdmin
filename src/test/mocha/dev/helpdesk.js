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

                if (e) throw e;

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

        it('Customers can NOT find others talks', function (done) {

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

                    var reqCustomerCurrent = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);

                    helpdeskController.talkAdd
                        (reqCustomerCurrent,
                        {
                            subject: "nueva conversacion de test"
                        },
                        function (err, addResult) {


                            var reqCustomerAnother = myUtils.extendDeep({ user: initDbData.customerAnother }, global);

                            helpdeskController.talkSearch
                                (reqCustomerAnother,
                                filter,
                                function (err, searchResult) {

                                    assert.equal(err, null, err === null ? '' : err.message);
                                    assert.equal(searchResult.isValid, true);
                                    assert.equal(searchResult.data.data.length === 0, true);

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

        it('Customers can NOT add messages to others talks', function (done) {

            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };


            helpdeskController.testMethodInitDb(function (e, initDbData) {

                if (e) throw e;



                var req = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);

                helpdeskController.talkAdd
                    (req,
                    {
                        subject: "nueva conversacion de test"
                    },
                    function (err, addResult) {

                        var reqCustomerAnother = myUtils.extendDeep({ user: initDbData.customerAnother }, global);

                        helpdeskController.messageAdd
                            (reqCustomerAnother,
                            {
                                idTalk: addResult.data.editData.idTalk,
                                message: 'hola esto es un mensaje de prueba'
                            },
                            function (err, messageAddResult) {

                                assert.equal(messageAddResult.isValid, false);
                                assert.equal(resultHasMessage(i18n.__("GeneralTexts.PermissionDenied"), messageAddResult.messages), true);

                                done();

                            });



                    });



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

        it('Customers can NOT Get all messages from others talks', function (done) {


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


                                    var reqCustomerAnother = myUtils.extendDeep({ user: initDbData.customerAnother }, global);

                                    filter.filter.idTalk = addResult.data.editData.idTalk;

                                    helpdeskController.messageGetAll
                                        (reqCustomerAnother,
                                        filter,
                                        function (err, messagesAll) {

                                            assert.equal(messagesAll.isValid, false);
                                            assert.equal(resultHasMessage(i18n.__("GeneralTexts.PermissionDenied"), messagesAll.messages), true);

                                            done();

                                        });
                                });
                        });
                }
            });

        });

        it('Customers UnreadMessages -> filters current user messages ', function (done) {

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
                                    //filter.filter.idMessageLastRead = 

                                    helpdeskController.messageGetUnread
                                        (req,
                                        filter,
                                        function (err, messagesUnread) {

                                            assert.equal(err, null, err === null ? '' : err.message);
                                            assert.equal(messagesUnread.isValid, true);
                                            assert.equal(messagesUnread.data.data.length === 0, true);

                                            //assert.equal(messagesUnread.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                            //assert.equal(messagesUnread.data.data[0].idTalk === messageAddResult.data.idTalk, true);
                                            //assert.equal(messagesUnread.data.data[0].idMessage === messageAddResult.data.idMessage, true);
                                            //assert.equal(messagesUnread.data.data[0].whoPosted.name === req.user.name, true);
                                            //assert.equal(messagesUnread.data.data[0].whoPosted.isEmployee === req.user.isEmployee, true);

                                            done();

                                        });
                                });
                        });
                }
            });

        });

        it('Customers UnreadMessages -> can get unread messages ', function (done) {

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

                    // 1.- an employee ads a talk
                    var reqEmployee = myUtils.extendDeep({ user: initDbData.employeeDefault }, global);

                    helpdeskController.talkSavedByEmployee
                        (reqEmployee,
                        {
                            isNew: true,
                            formData: {
                                subject: 'nueva conversaciopn de test',
                                customerInfo: {
                                    customerId: initDbData.customerCurrent.idPeople
                                }
                            }
                        },
                        function (err, addResult) {

                            if (err) throw err;

                            // 2.- an employee ads a message
                            helpdeskController.messageAdd
                                (reqEmployee,
                                {
                                    idTalk: addResult.data.editData.idTalk,
                                    message: 'hola esto es un mensaje de prueba'
                                },
                                function (err, messageAddResult) {


                                    // 3.- now switch to a customer and try getting unread messages

                                    var reqCustomer = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);

                                    filter.filter.idTalk = addResult.data.editData.idTalk;

                                    helpdeskController.messageGetUnread
                                        (reqCustomer,
                                        filter,
                                        function (err, messagesUnread) {

                                            assert.equal(err, null, err === null ? '' : err.message);
                                            assert.equal(messagesUnread.isValid, true);
                                            assert.equal(messagesUnread.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                            assert.equal(messagesUnread.data.data[0].idTalk === messageAddResult.data.idTalk, true);
                                            assert.equal(messagesUnread.data.data[0].idMessage === messageAddResult.data.idMessage, true);
                                            assert.equal(messagesUnread.data.data[0].whoPosted.name === reqEmployee.user.name, true);
                                            assert.equal(messagesUnread.data.data[0].whoPosted.isEmployee === reqEmployee.user.isEmployee, true);

                                            done();

                                        });
                                });
                        });
                }
            });

        });

        it('Customers can NOT GetUnread messages from others talks', function (done) {

            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };

            helpdeskController.testMethodInitDb(function (e, initDbData) {

                if (e) throw e;


                // 1.- an employee ads a talk
                var reqEmployee = myUtils.extendDeep({ user: initDbData.employeeDefault }, global);

                helpdeskController.talkSavedByEmployee
                    (reqEmployee,
                    {
                        isNew: true,
                        formData: {
                            subject: 'nueva conversaciopn de test',
                            customerInfo: {
                                customerId: initDbData.customerCurrent.idPeople
                            }
                        }
                    },
                    function (err, addResult) {

                        if (err) throw err;

                        // 2.- an employee ads a message
                        helpdeskController.messageAdd
                            (reqEmployee,
                            {
                                idTalk: addResult.data.editData.idTalk,
                                message: 'hola esto es un mensaje de prueba'
                            },
                            function (err, messageAddResult) {


                                // 3.- now switch to a customer and try getting unread messages

                                var reqCustomerAnother = myUtils.extendDeep({ user: initDbData.customerAnother }, global);

                                filter.filter.idTalk = addResult.data.editData.idTalk;

                                helpdeskController.messageGetUnread
                                    (reqCustomerAnother,
                                    filter,
                                    function (err, messagesUnread) {

                                        assert.equal(messagesUnread.isValid, false);
                                        assert.equal(resultHasMessage(i18n.__("GeneralTexts.PermissionDenied"), messagesUnread.messages), true);

                                        done();

                                    });
                            });
                    });

            });

        });

        it('Customers UnreadMessages -> filters lastMessage read', function (done) {

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

                    // 1.- an employee ads a talk
                    var reqEmployee = myUtils.extendDeep({ user: initDbData.employeeDefault }, global);


                    helpdeskController.talkSavedByEmployee
                        (reqEmployee,
                        {
                            isNew: true,
                            formData: {
                                subject: 'nueva conversaciopn de test',
                                customerInfo: {
                                    customerId: initDbData.customerCurrent.idPeople
                                }
                            }
                        },
                        function (err, addResult) {

                            // 2.- an employee ads a message
                            helpdeskController.messageAdd
                                (reqEmployee,
                                {
                                    idTalk: addResult.data.editData.idTalk,
                                    message: 'hola esto es un mensaje de prueba'
                                },
                                function (err, messageAddResultI) {


                                    // 3.- an employee ads another message
                                    helpdeskController.messageAdd
                                        (reqEmployee,
                                        {
                                            idTalk: addResult.data.editData.idTalk,
                                            message: 'hola esto es un mensaje de prueba'
                                        },
                                        function (err, messageAddResultII) {

                                            // 4.- now switch to a customer and try getting unread messages

                                            var reqCustomer = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);

                                            filter.filter.idTalk = addResult.data.editData.idTalk;
                                            filter.filter.idMessageLastRead = messageAddResultI.data.idMessage;

                                            helpdeskController.messageGetUnread
                                                (reqCustomer,
                                                filter,
                                                function (err, messagesUnread) {

                                                    assert.equal(err, null, err === null ? '' : err.message);
                                                    assert.equal(messagesUnread.isValid, true);
                                                    assert.equal(messagesUnread.data.data.length === 1, true);
                                                    assert.equal(messagesUnread.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                                    assert.equal(messagesUnread.data.data[0].idTalk === messageAddResultII.data.idTalk, true);
                                                    assert.equal(messagesUnread.data.data[0].idMessage === messageAddResultII.data.idMessage, true);
                                                    assert.equal(messagesUnread.data.data[0].whoPosted.name === reqEmployee.user.name, true);
                                                    assert.equal(messagesUnread.data.data[0].whoPosted.isEmployee === reqEmployee.user.isEmployee, true);

                                                    done();

                                                });
                                        });
                                });
                        });
                }
            });

        });

    });


    describe('Helpdesk Employees features', function () {

        it('Employee can add a talk', function (done) {


            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };


            helpdeskController.testMethodInitDb(function (e, initDbData) {

                if (e) throw e;


                var reqEmployee = myUtils.extendDeep({ user: initDbData.employeeCurrent }, global);

                helpdeskController.talkSavedByEmployee
                    (reqEmployee,
                    {
                        isNew: true,
                        formData: {
                            subject: 'nueva conversaciopn de test',
                            customerInfo: {
                                customerId: initDbData.customerCurrent.idPeople
                            }
                        }
                    },
                    function (err, addResult) {

                        if (err) throw err;


                        assert.equal(err, null, err === null ? '' : err.message);
                        assert.equal(addResult.isValid, true);
                        assert.equal(resultHasMessage(i18n.__("Helpdesk.Talks.Subject.NewSubjectAdded"), addResult.messages), true);

                        done();
                    });

            });

        });

        it('Employee can find their talks', function (done) {

            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };


            helpdeskController.testMethodInitDb(function (e, initDbData) {

                if (e) throw e;

                var reqEmployee = myUtils.extendDeep({ user: initDbData.employeeCurrent }, global);

                helpdeskController.talkSavedByEmployee
                    (reqEmployee,
                    {
                        isNew: true,
                        formData: {
                            subject: 'nueva conversaciopn de test',
                            customerInfo: {
                                customerId: initDbData.customerCurrent.idPeople
                            }
                        }
                    },
                    function (err, addResult) {

                        helpdeskController.talkSearch
                            (reqEmployee,
                            filter,
                            function (err, searchResult) {

                                assert.equal(err, null, err === null ? '' : err.message);
                                assert.equal(searchResult.isValid, true);
                                assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);

                                done();

                            });
                    });

            });
        });


    });

})();