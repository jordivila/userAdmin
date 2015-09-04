(function (module) {

    "use strict";


    var passport = require('passport');
    var BasicStrategy = require('passport-http').BasicStrategy;
    var myUtils = require('../libs/commonFunctions');
    var Encoder = require('node-html-encoder').Encoder;
    var DataResult = require('../../crossLayer/models/dataResult');
    var DataResultPaginated = require('../../crossLayer/models/dataResultPaginated');
    var _ = require("underscore");
    var config = require('../libs/config');
    var crossLayer = require('../../crossLayer/config');
    var P = require('p-promise');

    var HelpdeskTalkModel = require('../models/helpdesk').HelpdeskTalk;
    var HelpdeskPeopleModel = require('../models/helpdesk').HelpdeskPeople;
    var HelpdeskMessageModel = require('../models/helpdesk').HelpdeskMessage;
    var HelpdeskPeopleLastReadModel = require('../models/helpdesk').HelpdeskPeopleLastRead;
    var HelpdeskPeopleInvolvedModel = require('../models/helpdesk').HelpdeskPeopleInvolved;


    var crudAjaxOpts = {
        ajax: {
            _isInTestMode: true, // forced untill deployment. Then use -> config.get('IsTestEnv')
            _testEmployeeDefaultIdBackOffice: 2,
            _employeeDefaultGet: function (customerId, cb) {

                if (crudAjaxOpts.ajax._isInTestMode) {

                    HelpdeskPeopleModel.findOne({
                        isEmployee: true,
                        idPersonBackOffice: crudAjaxOpts.ajax._testEmployeeDefaultIdBackOffice
                    }, function (e, employeeDefault) {
                        if (e) return cb(e, null);

                        cb(null, employeeDefault);
                    });
                }
                else {
                    cb(new Error("Not implemented error"), null);
                }

            },
            _talkSave: function (i18n, idTalk, subject, customerId, employeeId, cb) {
                try {




                    var dataResult = null;
                    var modelErrors = [];
                    var isNew = idTalk === null;
                    var validate = function () {

                        if (((subject.trim() === '') === true)) {
                            modelErrors.push({ key: "subject", value: [i18n.__("Views.Crud.FieldRequired")] });
                        }

                        if (isNew && (customerId.toString().trim() === "")) {
                            modelErrors.push({ key: "customerInfo", value: [i18n.__("Views.Crud.FieldRequired")] });
                        }

                    }();





                    if (modelErrors.length > 0) {
                        dataResult = new DataResult(false, i18n.__("Views.Crud.ErrorExistsInForm"), { modelState: modelErrors });
                        cb(null, dataResult);
                    }
                    else {

                        subject = subject.trim();
                        employeeId = employeeId;
                        customerId = customerId;

                        


                        var helpdeskTalkSave = function (helpdeskTalk) {

                            helpdeskTalk.save(function (e, talkObject, numberAffected) {

                                if (e) return cb(e, null);

                                if (isNew) {
                                    idTalk = talkObject.idTalk;
                                }
                                else {

                                }



                                new HelpdeskPeopleInvolvedModel({
                                    idTalk: idTalk,
                                    idPeople: employeeId
                                }).save(function (e, employeeInvolved, numberAffected) {

                                    if (e) return cb(e, null);

                                    var sendResult = function () {



                                        dataResult = new DataResult(
                                            true,
                                            isNew ? i18n.__("Helpdesk.Talks.Subject.NewSubjectAdded") :
                                                    i18n.__("Template.Widget.Crud.SavedChanges"),
                                            {
                                                idTalk: idTalk
                                            });


                                        

                                        cb(null, dataResult);

                                    };


                                    if (isNew) {

                                        new HelpdeskPeopleInvolvedModel({
                                            idTalk: idTalk,
                                            idPeople: customerId
                                        }).save(function (e, customerInvolved, numberAffected) {
                                            sendResult();
                                        });

                                    }
                                    else {
                                        // existing talks must NOT change its customerId
                                        sendResult();
                                    }




                                });



                            });

                        };
                        //var helpdeskTalk = null;

                        if (idTalk === null) {
                            helpdeskTalkSave(new HelpdeskTalkModel({
                                subject: subject
                            }));
                        }
                        else {

                            if (idTalk === undefined) {
                                throw new Error("Argument exception");
                            }

                            //helpdeskTalk = new HelpdeskTalkModel({
                            //    idTalk: idTalk,
                            //    subject: subject
                            //});


                            HelpdeskTalkModel.findOne({ idTalk: idTalk },
                                function (e, helpdeskTalk) {

                                    if (e) return cb(e, null);


                                    helpdeskTalk.subject = subject;
                                    helpdeskTalkSave(helpdeskTalk);
                            });


                        }





                    }



                } catch (e) {
                    cb(e, null);
                }
            },
            _talkGetPeopleInvolved: function (idTalk, cb) {

                HelpdeskPeopleInvolvedModel.find({
                    idTalk: idTalk,
                }, function (e, peopleInvolved) {

                    if (e) return cb(e, null);

                    var peopleInvolvedIds = _.map(peopleInvolved, function (value, index, list) { return value.idPeople; });

                    HelpdeskPeopleModel.find({
                        idPeople: {
                            $in: peopleInvolvedIds
                        }
                    }, function (e, peopleInvolvedDetails) {

                        if (e) return cb(e, null);

                        cb(null, peopleInvolvedDetails);
                    });

                });
            },
            _fakeMessageObjectToViewModel: function (currentUserIdPeople, peopleInvolvedDetailsArray, message) {

                var whoPosted = _.first(_.filter(peopleInvolvedDetailsArray, function (elem) { return elem.idPeople == message.idPeople; }));



                return {
                    idMessage: message.idMessage,
                    idTalk: message.idTalk,
                    message: message.message,
                    datePosted: message.datePosted,
                    whoPosted: {
                        name: whoPosted.name,
                        isEmployee: whoPosted.isEmployee,
                        isCurrentUser: message.idPeople === currentUserIdPeople
                    }
                };

            },
            _userCanAccessTalk: function (idPeople, idTalk, cb) {

                crudAjaxOpts.ajax._talkGetPeopleInvolved(idTalk,
                    function (e, peopleInvolved) {

                        if (e) return cb(e, null);

                        var evens = _.filter(peopleInvolved, function (element) { return element.idPeople == idPeople; });

                        cb(null, evens.length > 0, peopleInvolved);

                    });
            },
            _userRequestCanAccessTalk: function (req, idTalk, cb) {
                crudAjaxOpts.ajax._userCanAccessTalk(req.user.idPeople, idTalk, cb);
            },
            _messageResultToViewModel: function (req, filter, peopleInvolvedDetails, messageArray, cb) {

                var dataResult = new DataResultPaginated();

                for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
                    if (i < messageArray.length) {
                        dataResult.data.data.push(crudAjaxOpts.ajax._fakeMessageObjectToViewModel(req.user.idPeople, peopleInvolvedDetails, messageArray[i]));
                    }
                }


                dataResult.isValid = true;
                dataResult.data.totalRows = messageArray.length;
                dataResult.data.page = filter.page;
                dataResult.data.pageSize = filter.pageSize;

                cb(null, dataResult);
            },
            _fakeDataGridTalkGetByIdForEdit: function (req, idTalk, cb) {

                try {



                    var i18n = req.i18n;
                    var dataResult = null;

                    HelpdeskTalkModel.findOne({
                        idTalk: idTalk
                    }, function (e, talk) {

                        if (e) return cb(e, null);

                        if (talk === null) {
                            cb(null, new DataResult(false, i18n.__("Helpdesk.Talks.TalkNotFound")));
                        }
                        else {

                            crudAjaxOpts.ajax._userRequestCanAccessTalk(req, idTalk,
                                function (e, hasPermission, peopleInvolved) {

                                    if (e) return cb(e, null);

                                    var customerInfo = function () {
                                        for (var i = 0; i < peopleInvolved.length; i++) {
                                            if (peopleInvolved[i].isEmployee === false) {
                                                return {
                                                    customerId: peopleInvolved[i].idPeople,
                                                    customerName: peopleInvolved[i].name
                                                };
                                            }
                                        }
                                        return null;
                                    }();


                                    //var dataObj = myUtils.extendDeep({}, talk);
                                    var dataObj = {
                                        idTalk: talk.idTalk,
                                        subject: talk.subject,
                                        dateLastMessage: talk.dateLastMessage,
                                        editData: {
                                            idTalk: talk.idTalk,
                                            subject: talk.subject,
                                            dateLastMessage: talk.dateLastMessage,
                                            customerInfo: customerInfo
                                        }
                                    };

                                    cb(null, new DataResult(true, "", dataObj));
                                });
                        }
                    });

                }
                catch (e) {
                    cb(e, null);
                }
            },
            _searchPeoplePaginated: function (mongooseFilter, page, pageSize, mapItemCallback, cb) {

                var query = HelpdeskPeopleModel.find(mongooseFilter);
                var queryCount = HelpdeskPeopleModel.find(mongooseFilter).count();

                query
                    .skip((page * pageSize))
                    .limit(pageSize)
                    .exec(function (e, people) {

                        if (e) return cb(e, null);

                        queryCount
                            .exec(function (e, peopleCount) {

                                if (e) return cb(e, null);

                                var dataResult = new DataResultPaginated();
                                dataResult.isValid = true;
                                dataResult.data.totalRows = peopleCount;
                                dataResult.data.page = page;
                                dataResult.data.pageSize = pageSize;
                                dataResult.data.data = _.map(people, mapItemCallback);

                                cb(null, dataResult);
                            });
                    });
            },


            reqCredentialsCheck: function (req, username, password, callback) {

                var i18n = req.i18n;

                var invalidCredentials = function () {
                    callback(null, false, {
                        message: i18n.__("AccountResources.InvalidCredentials")
                    });
                };

                var checkByCookieName = function (cookieName) {

                    if (req.cookies[cookieName]) {

                        var peopleId = req.cookies[cookieName];

                        HelpdeskPeopleModel.findOne({
                            idPeople: peopleId
                        }, function (err, peopleInfo) {

                            if (peopleInfo === null) {
                                invalidCredentials();
                            }
                            else {
                                callback(null, peopleInfo);
                            }


                        });

                    }
                    else {
                        invalidCredentials();
                    }
                };

                // some api routes are for customers
                // and another ones are for employees only
                // this methods returns tru if api route for the current request
                // was a customer route
                // See /src/backend/routing/routesApiUser.js
                if (req.params.apiEndpointType === 'customer') {
                    checkByCookieName(crossLayer.cookies.helpdeskCustomerId);
                }
                else {
                    checkByCookieName(crossLayer.cookies.helpdeskEmployeeId);
                }
            },
            reqAuthenticate: function (req, res, next) {

                //  when using basic auth passports sends header WWW-Authenticate
                //  which forces browser to show a dialog box asking for user credentials 
                //  

                //passport.authenticate('basic', {
                //    session: false
                //})(req, res, next);

                // I use a custom callback on passport baic auth
                // avoiding this header to be sent

                passport.authenticate(
                    'basic', {
                        session: false
                    },
                    function (err, user, info) {

                        if (err) {
                            return next(err);
                        }
                        if (!user) {
                            res.status(401);
                        }

                        req.user = user;

                        next();

                    })(req, res, next);
            },
            testMethodInitDb: function (cb) {

                var self = this;
                var dataToModel = function (all) {

                    var employeeCurrent = all.filter(function (element) {
                        return element.isEmployee === true;
                    })[0];
                    var employeeAnother = all.filter(function (element) {
                        return element.isEmployee === true;
                    })[1];
                    var employeeDefault = all.filter(function (element) {
                        return (element.isEmployee === true) && (element.idPersonBackOffice == crudAjaxOpts.ajax._testEmployeeDefaultIdBackOffice);
                    })[0];
                    var customerCurrent = all.filter(function (element) {
                        return element.isEmployee === false;
                    })[0];
                    var customerAnother = all.filter(function (element) {
                        return element.isEmployee === false;
                    })[1];


                    self._testEmployeeDefault = employeeDefault;


                    cb(null, {
                        all: all,
                        employeeCurrent: employeeCurrent,
                        employeeAnother: employeeAnother,
                        employeeDefault: employeeDefault,
                        customerCurrent: customerCurrent,
                        customerAnother: customerAnother
                    });


                };


                HelpdeskPeopleModel.find({}, function (e, existingData) {

                    if (existingData.length === 0) {
                        var pMax = 10; // pMax -> number of employees & number of customers created
                        var initPeople = function () {


                            var peopleSaved = [];

                            for (var j = 0; j < pMax; j++) {

                                peopleSaved.push(new HelpdeskPeopleModel({
                                    //idPeople: j,      // -> identity (1,1)
                                    idPersonBackOffice: j,    //identificaador de la persona en ORG_TB_EMLPEADOS
                                    isEmployee: true,
                                    name: "Empleado/Employee " + j,
                                    cardId: new Array(11).join(j.toString()),
                                    email: myUtils.stringFormatCSharp("{0}@something.com", new Array(6).join(j.toString()))
                                }).save());

                            }

                            for (var k = 0; k < pMax; k++) {

                                peopleSaved.push(new HelpdeskPeopleModel({
                                    //idPeople: pMax + k,
                                    idPersonBackOffice: k,    //identificaador de la persona en PEF_tb_personaFisica
                                    isEmployee: false,
                                    name: "Cliente/Customer " + k,
                                    cardId: new Array(11).join(k.toString()),
                                    email: myUtils.stringFormatCSharp("{0}@something.com", new Array(6).join(k.toString()))
                                }).save());
                            }



                            return P.all(peopleSaved).nodeify(function (e, data) {

                                if (e !== null) {
                                    cb(e, null);
                                }
                                else {
                                    HelpdeskPeopleModel.find({}, function (e, all) {
                                        dataToModel(all);
                                    });
                                }
                            });

                        }();
                    }
                    else {
                        dataToModel(existingData);
                    }
                });

            },
            talkSearch: function (req, params, cb) {

                var dataToViewModel = function (dataSourceArray, cb) {

                    var dataResult = new DataResultPaginated();
                    dataResult.isValid = true;
                    dataResult.data.totalRows = dataSourceArray.length;
                    dataResult.data.page = params.page;
                    dataResult.data.pageSize = params.pageSize;

                    for (var i = (params.page * params.pageSize) ; i < ((params.page * params.pageSize) + params.pageSize) ; i++) {
                        if (i < dataSourceArray.length) {
                            dataResult.data.data.push({
                                idTalk: dataSourceArray[i].idTalk,
                                subject: dataSourceArray[i].subject,
                                dateLastMessage: new Date(), // crudAjaxOpts.ajax._fakeMessagesGetDateLastMessage(dataSourceArray[i].idTalk),
                                nMessagesUnread: 0
                            });
                        }
                    }

                    return dataResult;
                };
                var performSearch = function (mongooseFilter) {

                    HelpdeskPeopleInvolvedModel.find(mongooseFilter,
                        function (err, data) {

                            if (err) return cb(err);

                            var userTalkIds = _.map(data, function (value, index, list) { return value.idTalk; });

                            var query = HelpdeskTalkModel.find({
                                idTalk: {
                                    $in: userTalkIds
                                },
                                //idTalk: userTalkIds, // valid as weell
                            }, function (err, userTalks) {

                                if (err) return cb(err, null);

                                //HelpdeskPeopleLastReadModel.find({
                                //    idPeople: req.user.idPeople
                                //}, function (err, lastReadResults) {

                                //    if (err) return cb(err, null);

                                return cb(null, dataToViewModel(userTalks));
                                //});

                            });

                        });


                };




                if (!req.user.isEmployee) {
                    // set filter on customer talks
                    performSearch({ idPeople: req.user.idPeople });
                }
                else {

                    // de momento tratamos las dos busquedas de la misma manera

                    var dbFilter = {};

                    var peopleInvolvedFilter = [];

                    if ((params.filter.customerInfo) && (params.filter.customerInfo.customerId !== "")) {
                        peopleInvolvedFilter.push(params.filter.customerInfo.customerId);
                    }

                    if ((params.filter.employeeInfo) && (params.filter.employeeInfo.employeeId !== "")) {
                        // comprobar si tiene permisos para buscar por otro empleado. Debe ser super user o admin ...
                        peopleInvolvedFilter.push(params.filter.employeeInfo.employeeId);
                    }

                    
                    // en caso de que no sea super user. Añadir el filtro de empleado
                    peopleInvolvedFilter.push(req.user.idPeople);


                    if (peopleInvolvedFilter.length > 0) {
                        dbFilter.idPeople = {
                            $in: peopleInvolvedFilter
                        };
                    }

                    performSearch(dbFilter);
                }

            },
            talkAdd: function (req, dataItem, cb) {

                crudAjaxOpts.ajax._employeeDefaultGet(req.user.idPeople, function (e, employeeDefault) {

                    if (e) return cb(e, null);

                    crudAjaxOpts.ajax._talkSave(
                        req.i18n,
                        null,
                        dataItem.subject,
                        req.user.idPeople, // customerId
                        employeeDefault.idPeople, //employeeId
                        function (e, dataResult) {

                            if (e) return cb(e, null);

                            if (dataResult.isValid === true) {

                                HelpdeskTalkModel.findOne({
                                    idTalk: dataResult.data.idTalk
                                }, function (e, talkDetail) {

                                    if (e) return cb(e, null);

                                    dataItem.editData = talkDetail;
                                    dataItem.formData = undefined;
                                    dataResult.data = dataItem;

                                    cb(null, dataResult);
                                });

                            }
                            else {
                                cb(null, dataResult);
                            }

                        });
                });
            },
            messageAdd: function (req, dataItem, cb) {

                var dataResult = null;
                var modelErrors = [];

                if (((dataItem.message.trim() === '') === true)) {
                    // do not validate
                    // In case message is empty then fail silently at backend
                    // as far as client validation should occur before arrive here

                    //modelErrors.push({ key: "message", value: [i18n.__("Views.Crud.FieldRequired")] });
                }

                if (modelErrors.length > 0) {
                    cb(null, new DataResult(false, req.i18n.__("Views.Crud.ErrorExistsInForm"), { modelState: modelErrors }));
                }
                else {

                    crudAjaxOpts.ajax._userRequestCanAccessTalk(req, dataItem.idTalk,
                        function (e, hasPermission, peopleInvolved) {


                            if (hasPermission) {

                                var messageDate = new Date();

                                new HelpdeskMessageModel({
                                    //idMessage: newId,
                                    idTalk: dataItem.idTalk,
                                    idPeople: req.user.idPeople, // this should be set at server runtime using authentication info
                                    message: dataItem.message, // --> REMEMBER !!!! as far as this is going to be at server side: do HtmlEncode of the dataItem.message property value (use some npm-hemlEncode existing module)
                                    datePosted: messageDate,
                                }).save(function (e, messageObject, messageNumberAffected) {

                                    if (e) return cb(e, null);

                                    HelpdeskTalkModel.findOne({
                                        idTalk: messageObject.idTalk
                                    }, function (e, talkObject) {

                                        if (e) return cb(e, null);

                                        HelpdeskTalkModel
                                            .update({ _id: talkObject._id }, { dateLastMessage: messageDate }, {},
                                            function (e, updateResult) {

                                                if (e) return cb(e, null);

                                                dataResult = new DataResult(true, "", messageObject);
                                                cb(null, dataResult);

                                            });
                                    });
                                });


                            }
                            else {
                                var dataResult = new DataResultPaginated();
                                dataResult.isValid = false;
                                dataResult.addMessage(req.i18n.__("GeneralTexts.PermissionDenied"));
                                cb(null, dataResult);
                            }


                        });
                }
            },
            messageGetAll: function (req, params, cb) {

                // simulate pagination. BUT set pageSize to a huge number
                // as far as client message page is not indended to be paginated
                // at least first version

                //var filter = {
                //    page: 0,
                //    pageSize: 1000,
                //    filter: {
                //        idTalk: idTalk
                //    }
                //};

                var filter = params;
                var idTalk = filter.filter.idTalk;



                crudAjaxOpts.ajax._userRequestCanAccessTalk(req, idTalk, function (e, hasPermission, peopleInvolvedDetails) {

                    if (e) return cb(e, null);

                    if (hasPermission) {

                        HelpdeskMessageModel.find({
                            idTalk: idTalk
                        }, function (e, messagesByIdTalk) {

                            crudAjaxOpts.ajax._messageResultToViewModel(
                                req,
                                filter,
                                peopleInvolvedDetails,
                                messagesByIdTalk,
                                function (e, dataResult) {

                                    if (e) return cb(e, null);

                                    cb(null, dataResult);
                                });

                        });
                    }
                    else {

                        var dataResult = new DataResultPaginated();
                        dataResult.isValid = false;
                        dataResult.addMessage(req.i18n.__("GeneralTexts.PermissionDenied"));
                        cb(null, dataResult);
                    }
                });

            },
            messageGetUnread: function (req, params, cb) {

                //var idTalk = params.idTalk;
                //var idMessageLastRead = params.idMessageLastRead;

                // simulate pagination. BUT set pageSize to a huge number
                // as far as client message page is not indended to be paginated
                // at least first version

                //var filter = {
                //    page: 0,
                //    pageSize: 1000,
                //    filter: {
                //        idTalk: idTalk,
                //        idMessageLastRead: idMessageLastRead
                //    }
                //};

                var filter = params;
                var idTalk = filter.filter.idTalk;
                var idMessageLastRead = filter.filter.idMessageLastRead;

                crudAjaxOpts.ajax._userRequestCanAccessTalk(req, idTalk, function (e, hasPermission, peopleInvolvedDetails) {

                    if (e) return cb(e, null);

                    if (hasPermission) {


                        HelpdeskMessageModel.findOne({
                            idMessage: idMessageLastRead
                        }, function (e, lastMessageRead) {

                            if (e) return cb(e, null);

                            var messageModelFilter = {
                                idTalk: idTalk,
                                idPeople: {
                                    $ne: req.user.idPeople
                                }
                            };

                            if (lastMessageRead !== null) {
                                messageModelFilter.datePosted = { $gt: lastMessageRead.datePosted };
                            }

                            HelpdeskMessageModel.find(messageModelFilter,
                                function (e, messagesByIdTalk) {

                                    var returnResult = function () {

                                        crudAjaxOpts.ajax._messageResultToViewModel(
                                            req,
                                            filter,
                                            peopleInvolvedDetails,
                                            messagesByIdTalk,
                                            function (e, dataResult) {

                                                if (e) return cb(e, null);

                                                cb(null, dataResult);
                                            });

                                    };
                                    var newMessageRead = _.last(messagesByIdTalk);

                                    if (newMessageRead) {
                                        new HelpdeskPeopleLastReadModel({
                                            idTalk: idTalk,
                                            idPeople: req.user.idPeople,
                                            idMessage: newMessageRead.idMessage,
                                            dateRead: new Date()
                                        }).save(function (e, talkObject, numberAffected) {
                                            returnResult();
                                        });
                                    }
                                    else {
                                        returnResult();
                                    }
                                });
                        });



                    }
                    else {
                        var dataResult = new DataResultPaginated();
                        dataResult.isValid = false;
                        dataResult.addMessage(req.i18n.__("GeneralTexts.PermissionDenied"));
                        cb(null, dataResult);
                    }
                });
            },
            /************************************************************
                                Methods for employee
            *************************************************************/
            talkGetById: function (req, dataItem, cb) {

                var dataResult = null;


                crudAjaxOpts.ajax._fakeDataGridTalkGetByIdForEdit(req, dataItem.idTalk,
                    function (e, dataResult) {
                        if (e) return cb(error, null);

                        cb(null, dataResult);

                    });
            },
            talkSavedByEmployee: function (req, dataItem, cb) {





                crudAjaxOpts.ajax._talkSave(
                    req.i18n,
                    dataItem.isNew === true ? null : dataItem.formData.idTalk,
                    dataItem.formData.subject,
                    dataItem.formData.customerInfo.customerId,  // customerId
                    req.user.idPeople, // employeeId
                    function (e, dataResult) {

                        if (e) return cb(e, null);




                        if (dataResult.isValid === true) {



                            crudAjaxOpts.ajax._fakeDataGridTalkGetByIdForEdit(
                                req,
                                dataResult.data.idTalk,
                                function (e, dataResultGetById) {

                                    if (e) return cb(e, null);

                                    if (dataResultGetById.isValid) {
                                        // ponemos en el mensaje de salida
                                        // el mensaje resultado de guardar
                                        dataResultGetById.messages[0] = dataResult.messages[0];
                                    }

                                    cb(null, dataResultGetById);
                                });
                        }
                        else {
                            cb(null, dataResult);
                        }
                    });
            },
            customerSearch: function (req, params, cb) {

                var dbFilter = { isEmployee: false };

                if ((params.filter.customerName) && (params.filter.customerName.trim() !== "")) {
                    dbFilter.name = new RegExp(myUtils.stringFormatCSharp('{0}', params.filter.customerName), "i");
                }

                if ((params.filter.customerCardId) && (params.filter.customerCardId.trim() !== "")) {
                    dbFilter.cardId = new RegExp(myUtils.stringFormatCSharp('{0}', params.filter.customerCardId), "i");
                }

                crudAjaxOpts.ajax._searchPeoplePaginated(
                    dbFilter,
                    params.page,
                    params.pageSize,
                    function (value, index, list) {
                        return {
                            customerCardId: value.cardId,
                            customerId: value.idPeople,
                            customerName: value.name
                        };
                    },
                    cb);

            },
            employeeSearch: function (req, params, cb) {

                var dbFilter = { isEmployee: true };

                if ((params.filter.employeeName) && (params.filter.employeeName.trim() !== "")) {
                    dbFilter.name = new RegExp(myUtils.stringFormatCSharp('{0}', params.filter.employeeName), "i");
                }

                if ((params.filter.employeeEmail) && (params.filter.employeeEmail.trim() !== "")) {
                    dbFilter.email = new RegExp(myUtils.stringFormatCSharp('{0}', params.filter.employeeEmail), "i");
                }

                crudAjaxOpts.ajax._searchPeoplePaginated(
                    dbFilter,
                    params.page,
                    params.pageSize,
                    function (value, index, list) {

                        return {
                            employeeId: value.idPeople,
                            employeeName: value.name,
                            employeeEmail: value.email
                        };

                    },
                    cb);
            }
        },
        cache: {

        }
    };


    if (crudAjaxOpts.ajax._isInTestMode) {
        crudAjaxOpts.ajax.testMethodInitDb(function (e, data) {

        });
    }


    passport.use(new BasicStrategy({ passReqToCallback: true }, crudAjaxOpts.ajax.reqCredentialsCheck));


    module.exports.testMethodInitDb = crudAjaxOpts.ajax.testMethodInitDb;
    module.exports.isAuthenticated = crudAjaxOpts.ajax.reqAuthenticate;
    module.exports.talkSearch = crudAjaxOpts.ajax.talkSearch;
    module.exports.talkAdd = crudAjaxOpts.ajax.talkAdd;
    module.exports.messageAdd = crudAjaxOpts.ajax.messageAdd;
    module.exports.messageGetAll = crudAjaxOpts.ajax.messageGetAll;
    module.exports.messageGetUnread = crudAjaxOpts.ajax.messageGetUnread;

    module.exports.talkGetById = crudAjaxOpts.ajax.talkGetById;
    module.exports.talkSavedByEmployee = crudAjaxOpts.ajax.talkSavedByEmployee;
    module.exports.customerSearch = crudAjaxOpts.ajax.customerSearch;
    module.exports.employeeSearch = crudAjaxOpts.ajax.employeeSearch;


})(module);
