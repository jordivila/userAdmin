module.exports = function (helpdeskControllerPath) {



    var pathToSrc = "./../../../../";

    // import the moongoose helper utilities
    var utils = require('./initMochaTests');
    var util = require('util');
    var assert = require("assert");
    var HelpdeskController = require(pathToSrc + helpdeskControllerPath);
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

    describe(helpdeskControllerPath + '---- Helpdesk Customers features', function () {

        it('Customer can add a talk', function (done) {

            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;


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


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;

                var req = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);



                helpdeskController.talkAdd
                    (req,
                    {
                        subject: "nueva conversacion de test"
                    },
                    function (err, addResult) {

                        if (err) throw err;

                        helpdeskController.messageAdd
                            (req,
                            {
                                idTalk: addResult.data.editData.idTalk,
                                message: 'hola esto es un mensaje de prueba'
                            },
                            function (err, messageAddResult) {

                                if (err) throw err;

                                filter.filter.idTalk = addResult.data.editData.idTalk;
                                //filter.filter.idMessageLastRead = 

                                helpdeskController.messageGetUnread
                                    (req,
                                    filter,
                                    function (err, messagesUnread) {

                                        if (err) throw err;


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


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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

            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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
                            function (err, messageAddResultI) {

                                if (err) throw err;



                                // 3.- an employee ads another message
                                helpdeskController.messageAdd
                                    (reqEmployee,
                                    {
                                        idTalk: addResult.data.editData.idTalk,
                                        message: 'hola esto es un mensaje de prueba'
                                    },
                                    function (err, messageAddResultII) {

                                        if (err) throw err;



                                        // 4.- now switch to a customer and try getting unread messages

                                        var reqCustomer = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);

                                        filter.filter.idTalk = addResult.data.editData.idTalk;
                                        filter.filter.idMessageLastRead = messageAddResultI.data.idMessage;

                                        helpdeskController.messageGetUnread
                                            (reqCustomer,
                                            filter,
                                            function (err, messagesUnread) {

                                                if (err) throw err;

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
            });

        });

        it('Customers owned messages do not compute as unread messages', function (done) {

            // when a customer writes a message 
            // This message should not compute as an unread message

            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;

                var reqCustomerCurrent = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);

                helpdeskController.talkAdd
                    (reqCustomerCurrent,
                    {
                        subject: "nueva conversacion de test"
                    },
                    function (err, addResult) {

                        if (err) throw err;

                        var filterGetAll = function () {
                            return {
                                filter: {
                                    idTalk: addResult.data.editData.idTalk
                                },
                                page: 0,
                                pageSize: 50,
                                sortAscending: false,
                                sortBy: ""
                            };
                        }();

                        helpdeskController.messageGetAll
                            (reqCustomerCurrent,
                            filterGetAll,
                            function (err, messagesAll) {

                                if (err) throw err;

                                helpdeskController.messageAdd
                                    (reqCustomerCurrent,
                                    {
                                        idTalk: addResult.data.editData.idTalk,
                                        message: 'The customer adds a message'
                                    },
                                    function (err, messageAddResult) {

                                        if (err) throw err;

                                        var filterSearch = function () {
                                            return {
                                                filter: {},
                                                page: 0,
                                                pageSize: 50,
                                                sortAscending: false,
                                                sortBy: ""
                                            };
                                        }();

                                        helpdeskController.talkSearch
                                            (reqCustomerCurrent,
                                            filterSearch,
                                            function (err, searchResult) {

                                                if (err) throw err;

                                                assert.equal(err, null, err === null ? '' : err.message);
                                                assert.equal(searchResult.isValid, true);
                                                assert.equal(searchResult.data.totalRows === 1, true);
                                                assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                                assert.equal(searchResult.data.data[0].nMessagesUnread === 0, true);

                                                done();
                                            });
                                    });
                            });
                    });
            });
        });

        it('Customers messages can get unread message number', function (done) {

            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;

                var reqCustomerCurrent = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);
                var reqEmployeeDefault = myUtils.extendDeep({ user: initDbData.employeeDefault }, global);


                helpdeskController.talkAdd
                    (reqCustomerCurrent,
                    {
                        subject: "nueva conversacion de test"
                    },
                    function (err, addResult) {

                        if (err) throw err;

                        var filterGetAll = {
                            filter: {
                                idTalk: addResult.data.editData.idTalk
                            },
                            page: 0,
                            pageSize: 50,
                            sortAscending: false,
                            sortBy: ""
                        };

                        helpdeskController.messageGetAll
                            (reqEmployeeDefault,
                            filterGetAll,
                            function (err, messagesAll) {

                                if (err) throw err;

                                helpdeskController.messageAdd
                                    (reqEmployeeDefault,
                                    {
                                        idTalk: addResult.data.editData.idTalk,
                                        message: 'The employee adds a message. Current employee should find it as "notRead" status search'
                                    },
                                    function (err, messageAddedByEmployeeResult) {

                                        if (err) throw err;

                                        var filter = {
                                            filter: {},
                                            page: 0,
                                            pageSize: 50,
                                            sortAscending: false,
                                            sortBy: ""
                                        };

                                        helpdeskController.talkSearch
                                            (reqCustomerCurrent,
                                            filter,
                                            function (err, searchResult) {

                                                if (err) throw err;




                                                assert.equal(err, null, err === null ? '' : err.message);
                                                assert.equal(searchResult.isValid, true);
                                                assert.equal(searchResult.data.totalRows === 1, true);
                                                assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                                assert.equal(searchResult.data.data[0].nMessagesUnread === 1, true);


                                                helpdeskController.messageGetAll
                                                    (reqCustomerCurrent,
                                                    filterGetAll,
                                                    function (err, messagesAll) {

                                                        if (err) throw err;


                                                        // Check first message is the message poseted by empluyee
                                                        assert.equal(err, null, err === null ? '' : err.message);
                                                        assert.equal(messageAddedByEmployeeResult.data.idMessage, messagesAll.data.data[0].idMessage);
                                                        assert.equal(messagesAll.data.data[0].whoPosted.isCurrentUser, false);


                                                        helpdeskController.talkSearch
                                                            (reqCustomerCurrent,
                                                            filter,
                                                            function (err, searchResult) {

                                                                if (err) throw err;

                                                                assert.equal(err, null, err === null ? '' : err.message);
                                                                assert.equal(searchResult.isValid, true);
                                                                assert.equal(searchResult.data.totalRows === 1, true);
                                                                assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                                                assert.equal(searchResult.data.data[0].nMessagesUnread === 0, true);


                                                                helpdeskController.messageGetAll
                                                                    (reqEmployeeDefault,
                                                                    filterGetAll,
                                                                    function (err, messagesAll) {

                                                                        if (err) throw err;


                                                                        // Check first message is the message poseted by empluyee
                                                                        assert.equal(err, null, err === null ? '' : err.message);
                                                                        assert.equal(messageAddedByEmployeeResult.data.idMessage, messagesAll.data.data[0].idMessage);
                                                                        assert.equal(messagesAll.data.data[0].whoPosted.isCurrentUser, true);

                                                                        done();
                                                                    });
                                                            });
                                                    });
                                            });
                                    });


                            });
                    });
            });
        });
    });

    describe(helpdeskControllerPath + '---- Helpdesk Employees features', function () {

        it('Employees can add a talk', function (done) {


            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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

        it('Employees can edit a talk', function (done) {


            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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





                        // simulate form data submit
                        var formDataSubmit = {
                            idTalk: addResult.data.editData.idTalk,
                            subject: addResult.data.editData.subject,
                            dateLastMessage: addResult.data.editData.dateLastMessage,
                            editData: {
                                idTalk: addResult.data.editData.idTalk,
                                subject: addResult.data.editData.subject,
                                dateLastMessage: addResult.data.editData.dateLastMessage,
                                customerInfo: {
                                    customerId: addResult.data.editData.customerInfo.customerId,
                                    customerName: addResult.data.editData.customerInfo.customerName
                                }
                            },
                            formData: {
                                idTalk: addResult.data.editData.idTalk,
                                subject: "nueva conversaciopn de test modificada",
                                customerInfo: {
                                    customerId: addResult.data.editData.customerInfo.customerId,
                                    customerName: addResult.data.editData.customerInfo.customerName
                                },
                                customerReadonly: null
                            }
                        };


                        helpdeskController.talkSavedByEmployee
                            (reqEmployee,
                            formDataSubmit,
                            function (err, editResult) {

                                if (err) throw err;


                                assert.equal(err, null, err === null ? '' : err.message);
                                assert.equal(editResult.isValid, true);
                                assert.equal(resultHasMessage(i18n.__("Template.Widget.Crud.SavedChanges"), editResult.messages), true);
                                assert.equal(editResult.data.editData.subject, formDataSubmit.formData.subject, true);

                                done();
                            });



                    });

            });

        });

        it('Employees can find their talks', function (done) {

            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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

                        helpdeskController.talkSavedByEmployee
                            (reqEmployee,
                            {
                                isNew: true,
                                formData: {
                                    subject: 'nueva conversaciopn de test',
                                    customerInfo: {
                                        customerId: initDbData.customerAnother.idPeople
                                    }
                                }
                            },
                            function (err, addResultII) {


                                var filter = {
                                    filter: {},
                                    page: 0,
                                    pageSize: 50,
                                    sortAscending: false,
                                    sortBy: ""
                                };

                                helpdeskController.talkSearch
                                    (reqEmployee,
                                    filter,
                                    function (err, searchResult) {

                                        assert.equal(err, null, err === null ? '' : err.message);
                                        assert.equal(searchResult.isValid, true);
                                        assert.equal(searchResult.data.totalRows === 2, true);
                                        // remember talks are sorted by dateLastMessage
                                        assert.equal(searchResult.data.data[0].idTalk === addResultII.data.editData.idTalk, true);
                                        assert.equal(searchResult.data.data[1].idTalk === addResult.data.editData.idTalk, true);

                                        done();

                                    });
                            });
                    });
            });
        });

        it('Employees can find their talks & filter by customer', function (done) {


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

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

                        helpdeskController.talkSavedByEmployee
                            (reqEmployee,
                            {
                                isNew: true,
                                formData: {
                                    subject: 'nueva conversaciopn de test',
                                    customerInfo: {
                                        customerId: initDbData.customerAnother.idPeople
                                    }
                                }
                            },
                            function (err, addResultII) {

                                if (err) throw err;

                                var filter = {
                                    filter: {
                                    },
                                    page: 0,
                                    pageSize: 50,
                                    sortAscending: false,
                                    sortBy: ""
                                };


                                helpdeskController.talkSearch
                                    (reqEmployee,
                                    filter,
                                    function (err, searchResult) {

                                        if (err) throw err;

                                        assert.equal(err, null, err === null ? '' : err.message);
                                        assert.equal(searchResult.isValid, true);
                                        assert.equal(searchResult.data.totalRows === 2, true);
                                        // remember talks are sorted by dateLastMessage
                                        assert.equal(searchResult.data.data[0].idTalk === addResultII.data.editData.idTalk, true);
                                        assert.equal(searchResult.data.data[1].idTalk === addResult.data.editData.idTalk, true);


                                        filter.filter.customerInfo = {
                                            customerId: initDbData.customerCurrent.idPeople
                                        };


                                        helpdeskController.talkSearch
                                            (reqEmployee,
                                            filter,
                                            function (err, searchResult) {

                                                if (err) throw err;


                                                assert.equal(err, null, err === null ? '' : err.message);
                                                assert.equal(searchResult.isValid, true);
                                                assert.equal(searchResult.data.totalRows === 1, true);
                                                assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);

                                                done();

                                            });
                                    });
                            });
                    });
            });
        });

        it('Employee can find & filter customers', function (done) {

            var filter = {
                filter: { customerName: "", customerCardId: "" },
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };

            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;

                var reqEmployee = myUtils.extendDeep({ user: initDbData.employeeCurrent }, global);

                helpdeskController.customerSearch
                    (reqEmployee,
                    filter,
                    function (err, customerResults) {

                        assert.equal(err, null, err === null ? '' : err.message);
                        assert.equal(customerResults.isValid, true);
                        assert.equal(customerResults.data.totalRows ===
                            _.filter(initDbData.all, function (elem) {
                                return elem.isEmployee === false;
                            }).length, true);



                        filter.filter.customerCardId = initDbData.customerCurrent.cardId;

                        helpdeskController.customerSearch
                            (reqEmployee,
                            filter,
                            function (err, customerResults) {

                                assert.equal(err, null, err === null ? '' : err.message);
                                assert.equal(customerResults.isValid, true);
                                assert.equal(customerResults.data.totalRows === 1, true);

                                filter.filter.customerCardId = "";
                                filter.filter.customerName = initDbData.customerCurrent.name;

                                helpdeskController.customerSearch
                                    (reqEmployee,
                                    filter,
                                    function (err, customerResults) {




                                        assert.equal(err, null, err === null ? '' : err.message);
                                        assert.equal(customerResults.isValid, true);
                                        assert.equal(customerResults.data.totalRows === 1, true);

                                        done();

                                    });
                            });
                    });
            });
        });

        it('Employee can find & filter employees', function (done) {

            var filter = {
                filter: { employeeName: "", employeeEmail: "" },
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };

            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;

                var reqEmployee = myUtils.extendDeep({ user: initDbData.employeeCurrent }, global);

                helpdeskController.employeeSearch
                    (reqEmployee,
                    filter,
                    function (err, employeeResults) {

                        assert.equal(err, null, err === null ? '' : err.message);
                        assert.equal(employeeResults.isValid, true);
                        assert.equal(employeeResults.data.totalRows ===
                            _.filter(initDbData.all, function (elem) {
                                return elem.isEmployee === true;
                            }).length, true);



                        filter.filter.employeeEmail = initDbData.employeeCurrent.email;

                        helpdeskController.employeeSearch
                            (reqEmployee,
                            filter,
                            function (err, employeeResults) {

                                assert.equal(err, null, err === null ? '' : err.message);
                                assert.equal(employeeResults.isValid, true);
                                assert.equal(employeeResults.data.totalRows === 1, true);

                                filter.filter.employeeEmail = "";
                                filter.filter.employeeName = initDbData.employeeCurrent.name;

                                helpdeskController.employeeSearch
                                    (reqEmployee,
                                    filter,
                                    function (err, employeeResults) {

                                        assert.equal(err, null, err === null ? '' : err.message);
                                        assert.equal(employeeResults.isValid, true);
                                        assert.equal(employeeResults.data.totalRows === 1, true);
                                        done();

                                    });
                            });
                    });
            });
        });

        it('Employees can add messages to their talks', function (done) {

            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;

                var req = myUtils.extendDeep({ user: initDbData.employeeCurrent }, global);

                helpdeskController.talkSavedByEmployee
                    (req,
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
            });
        });

        it('Employees can NOT add messages to others talks', function (done) {

            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;



                var reqEmployeeCurrent = myUtils.extendDeep({ user: initDbData.employeeCurrent }, global);

                helpdeskController.talkSavedByEmployee
                    (reqEmployeeCurrent,
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

                    var reqEmployeeAnother = myUtils.extendDeep({ user: initDbData.employeeAnother }, global);

                    helpdeskController.messageAdd
                        (reqEmployeeAnother,
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

        it('Employees can NOT Get all messages from others talks', function (done) {

            var filter = {
                filter: {},
                page: 0,
                pageSize: 50,
                sortAscending: false,
                sortBy: ""
            };


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;


                var reqEmployeeCurrent = myUtils.extendDeep({ user: initDbData.employeeCurrent }, global);

                helpdeskController.talkSavedByEmployee
                    (reqEmployeeCurrent,
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

                        helpdeskController.messageAdd
                            (reqEmployeeCurrent,
                            {
                                idTalk: addResult.data.editData.idTalk,
                                message: 'hola esto es un mensaje de prueba'
                            },
                            function (err, messageAddResult) {

                                var reqEmployeeAnother = myUtils.extendDeep({ user: initDbData.employeeAnother }, global);

                                filter.filter.idTalk = addResult.data.editData.idTalk;

                                helpdeskController.messageGetAll
                                    (reqEmployeeAnother,
                                    filter,
                                    function (err, messagesAll) {

                                        assert.equal(messagesAll.isValid, false);
                                        assert.equal(resultHasMessage(i18n.__("GeneralTexts.PermissionDenied"), messagesAll.messages), true);

                                        done();

                                    });
                            });
                    });
            });
        });

        it('Employees can Get all messages from their talks', function (done) {

            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;

                var req = myUtils.extendDeep({ user: initDbData.employeeCurrent }, global);


                helpdeskController.talkSavedByEmployee
                    (req,
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

                        helpdeskController.messageAdd
                            (req,
                            {
                                idTalk: addResult.data.editData.idTalk,
                                message: 'hola esto es un mensaje de prueba'
                            },
                            function (err, messageAddResult) {

                                if (err) throw err;

                                var filter = function () {
                                    return {
                                        filter: {},
                                        page: 0,
                                        pageSize: 50,
                                        sortAscending: false,
                                        sortBy: ""
                                    };
                                }();

                                filter.filter.idTalk = addResult.data.editData.idTalk;

                                helpdeskController.messageGetAll
                                    (req,
                                    filter,
                                    function (err, messagesAll) {

                                        if (err) throw err;

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
            });
        });

        it('Employee unread messages get updated', function (done) {


            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;

                var reqEmployeeCurrent = myUtils.extendDeep({ user: initDbData.employeeCurrent }, global);
                var reqCustomerCurrent = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);

                helpdeskController.talkSavedByEmployee
                    (reqEmployeeCurrent,
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

                        helpdeskController.messageAdd
                            (reqCustomerCurrent,
                            {
                                idTalk: addResult.data.editData.idTalk,
                                message: 'The customer adds a message. Current employee should find it as "notRead" status search'
                            },
                            function (err, messageAddResult) {

                                if (err) throw err;

                                var filter = function () {
                                    return {
                                        filter: {
                                            customerInfo: {
                                                customerId: initDbData.customerCurrent.idPeople
                                            },
                                            //lastMessageStatus: helpdeskCrossLayer.talkStatus.notRead,
                                            //employeeInfo: {
                                            //    employeeId: initDbData.employeeCurrent.idPeople
                                            //}
                                        },
                                        page: 0,
                                        pageSize: 50,
                                        sortAscending: false,
                                        sortBy: ""
                                    };

                                }();

                                helpdeskController.talkSearch
                                    (reqEmployeeCurrent,
                                    filter,
                                    function (err, searchResult) {

                                        if (err) throw err;

                                        assert.equal(err, null, err === null ? '' : err.message);
                                        assert.equal(searchResult.isValid, true);
                                        assert.equal(searchResult.data.totalRows === 1, true);
                                        assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                        assert.equal(searchResult.data.data[0].nMessagesUnread === 1, true);




                                        var filterGetAll = {
                                            filter: {
                                                idTalk: addResult.data.editData.idTalk
                                            },
                                            page: 0,
                                            pageSize: 50,
                                            sortAscending: false,
                                            sortBy: ""
                                        };



                                        helpdeskController.messageGetAll
                                            (reqEmployeeCurrent,
                                            filterGetAll,
                                            function (err, messagesAll) {

                                                if (err) throw err;

                                                helpdeskController.talkSearch
                                                    (reqEmployeeCurrent,
                                                    filter,
                                                    function (err, searchResult) {

                                                        if (err) throw err;

                                                        assert.equal(err, null, err === null ? '' : err.message);
                                                        assert.equal(searchResult.isValid, true);
                                                        assert.equal(searchResult.data.totalRows === 1, true);
                                                        assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                                        assert.equal(searchResult.data.data[0].nMessagesUnread === 0, true);

                                                        done();
                                                    });
                                            });
                                    });
                            });
                    });
            });
        });

        it('Employee can find their talks & filter by status', function (done) {

            // 1,. Init database users 
            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;

                var reqEmployeeCurrent = myUtils.extendDeep({ user: initDbData.employeeCurrent }, global);
                var reqCustomerCurrent = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);

                // Employee creates a talk
                helpdeskController.talkSavedByEmployee
                    (reqEmployeeCurrent,
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

                        // Customer adds a message in employees conversation

                        helpdeskController.messageAdd
                            (reqCustomerCurrent,
                            {
                                idTalk: addResult.data.editData.idTalk,
                                message: 'The customer adds a message. Current employee should find it as "notRead" status search'
                            },
                            function (err, messageAddResult) {

                                if (err) throw err;

                                // Employee searches talks where current customer is involved
                                var filter = function () {
                                    return {
                                        filter: {
                                            customerInfo: {
                                                customerId: initDbData.customerCurrent.idPeople
                                            },
                                            //employeeInfo: {
                                            //    employeeId: initDbData.employeeCurrent.idPeople
                                            //}
                                        },
                                        page: 0,
                                        pageSize: 50,
                                        sortAscending: false,
                                        sortBy: ""
                                    };

                                }();


                                // Employee sets filter on messages not read
                                filter.filter.lastMessageStatus = helpdeskCrossLayer.talkStatus.notRead;

                                // As employee still has not read conversation messages
                                // This search should return the message added by the customer
                                helpdeskController.talkSearch
                                    (reqEmployeeCurrent,
                                    filter,
                                    function (err, searchResult) {

                                        if (err) throw err;

                                        assert.equal(err, null, err === null ? '' : err.message);
                                        assert.equal(searchResult.isValid, true);
                                        assert.equal(searchResult.data.totalRows === 1, true);
                                        assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                        assert.equal(searchResult.data.data[0].nMessagesUnread === 1, true);


                                        // Employee searches for pending answer messages
                                        filter.filter.lastMessageStatus = helpdeskCrossLayer.talkStatus.pendingAnswer;

                                        // Employee should find the previous message as pending answered
                                        // Because employee did not even read the message
                                        helpdeskController.talkSearch
                                            (reqEmployeeCurrent,
                                            filter,
                                            function (err, searchResult) {

                                                if (err) throw err;

                                                assert.equal(err, null, err === null ? '' : err.message);
                                                assert.equal(searchResult.isValid, true);
                                                assert.equal(searchResult.data.totalRows === 1, true);
                                                assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                                assert.equal(searchResult.data.data[0].nMessagesUnread === 1, true);



                                                var filterGetAll = {
                                                    filter: {
                                                        idTalk: addResult.data.editData.idTalk
                                                    },
                                                    page: 0,
                                                    pageSize: 50,
                                                    sortAscending: false,
                                                    sortBy: ""
                                                };



                                                // Employee reads talk messages
                                                helpdeskController.messageGetAll
                                                    (reqEmployeeCurrent,
                                                    filterGetAll,
                                                    function (err, messagesAll) {


                                                        filter.filter.lastMessageStatus = helpdeskCrossLayer.talkStatus.notRead;

                                                        // Employee should find no messages 
                                                        // as far as it has already read them
                                                        helpdeskController.talkSearch
                                                            (reqEmployeeCurrent,
                                                            filter,
                                                            function (err, searchResult) {

                                                                if (err) throw err;

                                                                assert.equal(err, null, err === null ? '' : err.message);
                                                                assert.equal(searchResult.isValid, true);
                                                                assert.equal(searchResult.data.totalRows === 0, true);
                                                                //assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);
                                                                //assert.equal(searchResult.data.data[0].nMessagesUnread === 0, true);




                                                                filter.filter.lastMessageStatus = helpdeskCrossLayer.talkStatus.pendingAnswer;

                                                                helpdeskController.talkSearch
                                                                    (reqEmployeeCurrent,
                                                                    filter,
                                                                    function (err, searchResult) {

                                                                        if (err) throw err;

                                                                        assert.equal(err, null, err === null ? '' : err.message);
                                                                        assert.equal(searchResult.isValid, true);
                                                                        // Employee should find a pending writing message
                                                                        // as far as did read but not write an answer
                                                                        assert.equal(searchResult.data.totalRows === 1, true);



                                                                        // Employee writes an answer
                                                                        helpdeskController.messageAdd
                                                                            (reqEmployeeCurrent,
                                                                            {
                                                                                idTalk: addResult.data.editData.idTalk,
                                                                                message: 'The employee answers a message. '
                                                                            },
                                                                            function (err, messageAddResult) {

                                                                                if (err) throw err;


                                                                                filter.filter.lastMessageStatus = helpdeskCrossLayer.talkStatus.pendingAnswer;

                                                                                helpdeskController.talkSearch
                                                                                    (reqEmployeeCurrent,
                                                                                    filter,
                                                                                    function (err, searchResult) {

                                                                                        if (err) throw err;

                                                                                        assert.equal(err, null, err === null ? '' : err.message);
                                                                                        assert.equal(searchResult.isValid, true);
                                                                                        assert.equal(searchResult.data.totalRows === 0, true);





                                                                                        filter.filter.lastMessageStatus = helpdeskCrossLayer.talkStatus.notRead;

                                                                                        helpdeskController.talkSearch
                                                                                            (reqEmployeeCurrent,
                                                                                            filter,
                                                                                            function (err, searchUnreadResultAfterWriteAnAnswer) {

                                                                                                if (err) throw err;

                                                                                                assert.equal(err, null, err === null ? '' : err.message);
                                                                                                assert.equal(searchUnreadResultAfterWriteAnAnswer.isValid, true);
                                                                                                assert.equal(searchUnreadResultAfterWriteAnAnswer.data.totalRows === 0, true);

                                                                                                done();
                                                                                            });
                                                                                    });
                                                                            });
                                                                    });
                                                            });
                                                    });
                                            });
                                    });
                            });
                    });
            });
        });

        //it('Employees with admin profile can find their talks & filter by employee', function (done) {


        //    helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

        //        if (e) throw e;

        //        var reqEmployeeFirst = myUtils.extendDeep({ user: initDbData.employeeCurrent }, global);

        //        // 1.- An emeployee ads a conversation

        //        helpdeskController.talkSavedByEmployee
        //            (reqEmployeeFirst,
        //            {
        //                isNew: true,
        //                formData: {
        //                    subject: 'nueva conversaciopn de test',
        //                    customerInfo: {
        //                        customerId: initDbData.customerCurrent.idPeople
        //                    }
        //                }
        //            },
        //            function (err, addResult) {


        //                // 2.- Another emeployee ads a conversation

        //                var reqEmployeeSecond = myUtils.extendDeep({ user: initDbData.employeeAnother }, global);

        //                helpdeskController.talkSavedByEmployee
        //                    (reqEmployeeSecond,
        //                    {
        //                        isNew: true,
        //                        formData: {
        //                            subject: 'nueva conversaciopn de test',
        //                            customerInfo: {
        //                                customerId: initDbData.customerCurrent.idPeople
        //                            }
        //                        }
        //                    },
        //                    function (err, addResultII) {


        //                        // 3.- a super Employee searches by first employeeId. Should find first talk
        //                        var reqEmployeeAdmin = myUtils.extendDeep({ user: initDbData.employeeDefault }, global);

        //                        var filter = {
        //                            filter: {
        //                                employeeInfo: {
        //                                    employeeId: reqEmployeeFirst.user.idPeople
        //                                }
        //                            },
        //                            page: 0,
        //                            pageSize: 50,
        //                            sortAscending: false,
        //                            sortBy: ""
        //                        };


        //                        helpdeskController.talkSearch
        //                            (reqEmployeeAdmin,
        //                            filter,
        //                            function (err, searchResult) {

        //                                assert.equal(err, null, err === null ? '' : err.message);
        //                                assert.equal(searchResult.isValid, true);
        //                                assert.equal(searchResult.data.totalRows === 1, true);
        //                                assert.equal(searchResult.data.data[0].idTalk === addResult.data.editData.idTalk, true);

        //                                // 4.- a super employee searches by second employeeId. Should find second talk

        //                                filter.filter.employeeInfo.employeeId = reqEmployeeSecond.user.idPeople;

        //                                helpdeskController.talkSearch
        //                                    (reqEmployeeAdmin,
        //                                    filter,
        //                                    function (err, searchResult) {

        //                                        assert.equal(err, null, err === null ? '' : err.message);
        //                                        assert.equal(searchResult.isValid, true);
        //                                        assert.equal(searchResult.data.totalRows === 1, true);
        //                                        assert.equal(searchResult.data.data[0].idTalk === addResultII.data.editData.idTalk, true);

        //                                        done();

        //                                    });
        //                            });
        //                    });
        //            });
        //    });
        //});

    });

    describe(helpdeskControllerPath + '---- Helpdesk Check Whoposted', function () {

        it('Message who posted info is Ok', function (done) {

            helpdeskController.testMethodInitDb(i18n, function (e, initDbData) {

                if (e) throw e;

                var reqCustomerCurrent = myUtils.extendDeep({ user: initDbData.customerCurrent }, global);
                var reqEmployeeDefault = myUtils.extendDeep({ user: initDbData.employeeDefault }, global);


                helpdeskController.talkAdd
                    (reqCustomerCurrent,
                    {
                        subject: "new chat conversation"
                    },
                    function (err, addResult) {

                        if (err) throw err;

                        var filterGetAll = {
                            filter: {
                                idTalk: addResult.data.editData.idTalk
                            },
                            page: 0,
                            pageSize: 50,
                            sortAscending: false,
                            sortBy: ""
                        };

                        helpdeskController.messageGetAll
                            (reqEmployeeDefault,
                            filterGetAll,
                            function (err, messagesAll) {

                                if (err) throw err;

                                helpdeskController.messageAdd
                                    (reqEmployeeDefault,
                                    {
                                        idTalk: addResult.data.editData.idTalk,
                                        message: 'The employee adds a message. Current employee should find it as "notRead" status search'
                                    },
                                    function (err, messageAddedByEmployeeResult) {

                                        if (err) throw err;

                                        helpdeskController.messageGetAll
                                            (reqCustomerCurrent,
                                            filterGetAll,
                                            function (err, messagesAll) {

                                                if (err) throw err;


                                                // Check first message is the message poseted by empluyee
                                                assert.equal(err, null, err === null ? '' : err.message);
                                                assert.equal(messageAddedByEmployeeResult.data.idMessage, messagesAll.data.data[0].idMessage);
                                                assert.equal(messagesAll.data.data[0].whoPosted.isCurrentUser, false);


                                                helpdeskController.messageGetAll
                                                    (reqEmployeeDefault,
                                                    filterGetAll,
                                                    function (err, messagesAll) {

                                                        if (err) throw err;

                                                        // Check first message is the message poseted by empluyee
                                                        assert.equal(err, null, err === null ? '' : err.message);
                                                        assert.equal(messageAddedByEmployeeResult.data.idMessage, messagesAll.data.data[0].idMessage);
                                                        assert.equal(messagesAll.data.data[0].whoPosted.isCurrentUser, true);

                                                        done();
                                                    });

                                            });

                                    });


                            });
                    });
            });
        });


    });

};