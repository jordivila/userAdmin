(function (module) {

    "use strict";


    module.exports = HelpdeskAPIController;

    var passport = require('passport');
    var BasicStrategy = require('passport-http').BasicStrategy;
    var myUtils = require('../libs/commonFunctions');
    var Encoder = require('node-html-encoder').Encoder;
    var DataResult = require('../../crossLayer/models/dataResult');
    var DataResultPaginated = require('../../crossLayer/models/dataResultPaginated');
    var _ = require("underscore");
    var config = require('../libs/config');
    var crossLayer = require('../../crossLayer/config');
    var helpdeskCrossLayer = require('../../crossLayer/helpdesk');
    var P = require('p-promise');
    var http = require('http');
    var querystring = require('querystring');
    var ErrorHandledModel = require('../../crossLayer/models/errorHandled');
    var normalizeForSearch = require('normalize-for-search');

    var HelpdeskTalkModel = require('../models/helpdesk').HelpdeskTalk;
    var HelpdeskPeopleModel = require('../models/helpdesk').HelpdeskPeople;
    var HelpdeskMessageModel = require('../models/helpdesk').HelpdeskMessage;
    var HelpdeskPeopleLastReadModel = require('../models/helpdesk').HelpdeskPeopleLastRead;
    var HelpdeskPeopleLastWriteModel = require('../models/helpdesk').HelpdeskPeopleLastWrite;
    var HelpdeskPeopleInvolvedModel = require('../models/helpdesk').HelpdeskPeopleInvolved;


    function HelpdeskAPIController() {
        this._isInTestMode = true;
    }


    HelpdeskAPIController.prototype.reqCredentialsCheck = function (req, username, password, callback) {

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
    };
    HelpdeskAPIController.prototype.isAuthenticated = function (req, res, next) {

        //  when using basic auth passports sends header WWW-Authenticate
        //  which forces browser to show a dialog box asking for user credentials 
        //  

        //passport.authenticate('basic', {
        //    session: false
        //})(req, res, next);

        // I use a custom callback on passport baic auth
        // avoiding this header to be sent

        passport.authenticate(
            'helpdeskStrategy', {
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


    };


    HelpdeskAPIController.prototype.apiRequest = function (path, cb) {


        var options = {
            host: 'localhost',
            port: 12345,
            path: path,
            method: 'GET',
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/json; charset=utf-8',
                //'Content-Length': postData.length
            },
        };

        var bufferJson = "";
        var reqClient = http.request(options, function (res) {
            console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                bufferJson += chunk;
            });
            res.on('end', function () {


                if (res.statusCode !== 200) {
                    cb(new ErrorHandledModel(i18n.__("Views.Layout.UnExpectedError"), res), null);
                }
                else {
                    cb(null, JSON.parse(bufferJson));
                    //cb(null, JSON.parse(bufferJson.join()));

                    //try {
                    //    cb(null, JSON.parse(JSON.stringify(bufferJson.join())));
                    //} catch (e) {
                    //    cb(e, null);
                    //}
                }
            });
        });

        reqClient.on('error', function (e) {
            cb(e, null);
        });

        reqClient.end();


    };

    //HelpdeskAPIController.prototype.importCustomers = function (pageSize, cb) {

    //    var path = '/api/manager/customers/';

    //    if (pageSize && (pageSize > 0)) {
    //        path += '/' + pageSize + '/1';
    //    }

    //    this.apiRequestImport(path, cb);
    //};
    //HelpdeskAPIController.prototype.importEmployees = function (pageSize, cb) {

    //    var path = '/api/manager/employees/';

    //    if (pageSize && (pageSize > 0)) {
    //        path += '/' + pageSize + '/1';
    //    }

    //    this.apiRequestImport(path, cb);

    //};
    //HelpdeskAPIController.prototype.importGetData = function (pageSize, cb) {

    //    var self = this;

    //    console.log("IMPORT GET DATA Employees BEGIN");

    //    self.importEmployees(pageSize, function (e, employees) {

    //        if (e) return cb(e, null);

    //        console.log("IMPORT GET DATA Custoemrs BEGIN");

    //        self.importCustomers(pageSize, function (e, customers) {

    //            if (e) return cb(e, null);

    //            console.log("IMPORT GET DATA FINISHED");

    //            self._importDataCache.customers = customers;
    //            self._importDataCache.employees = employees;
    //            self._importDataCache.isEmpty = false;

    //            cb(null, self._importDataCache);

    //        });

    //    });

    //};
    //HelpdeskAPIController.prototype.importSetData = function (cb) {

    //    var self = this;
    //    var dataToModel = function (all) {

    //        var employeeCurrent = all.filter(function (element) {
    //            return element.isEmployee === true;
    //        })[0];
    //        var employeeAnother = all.filter(function (element) {
    //            return element.isEmployee === true;
    //        })[1];
    //        var employeeDefault = all.filter(function (element, elementIndex, elementsList) {

    //            //var isDefaultEmployee = (element.isEmployee === true) && (element.idPersonBackOffice == self._testEmployeeDefaultIdBackOffice);
    //            var isDefaultEmployee = (element.isEmployee === true);

    //            return isDefaultEmployee;

    //        })[2];

    //        self._testEmployeeDefaultIdBackOffice = employeeDefault.idPersonBackOffice;

    //        var customerCurrent = all.filter(function (element) {
    //            return element.isEmployee === false;
    //        })[0];
    //        var customerAnother = all.filter(function (element) {
    //            return element.isEmployee === false;
    //        })[1];

    //        cb(null, {
    //            all: all,
    //            employeeCurrent: employeeCurrent,
    //            employeeAnother: employeeAnother,
    //            employeeDefault: employeeDefault,
    //            customerCurrent: customerCurrent,
    //            customerAnother: customerAnother
    //        });

    //    };

    //    console.log("Import set Data");

    //    var dataEmployeeSave = null;
    //    var dataCustomerSave = null;

    //    dataCustomerSave = function (currentIndexCustomers) {

    //        console.log("Import set customer->" + currentIndexCustomers);

    //        if (currentIndexCustomers >= self._importDataCache.customers.length) {


    //            console.log("Import set customer finished");

    //            HelpdeskPeopleModel
    //                .find({})
    //                .skip(0)
    //                .limit(2000)
    //                .exec(function (e, all) {

    //                    if (e) return cb(e, null);

    //                    console.log("Import get all ");

    //                    dataToModel(all);
    //                });

    //        }
    //        else {

    //            var name = self._importDataCache.customers[currentIndexCustomers].apellido1 + ' ' +
    //                       self._importDataCache.customers[currentIndexCustomers].apellido2 + ' , ' +
    //                       self._importDataCache.customers[currentIndexCustomers].nombre;

    //            new HelpdeskPeopleModel({
    //                //idPeople: pMax + k,
    //                idPersonBackOffice: self._importDataCache.customers[currentIndexCustomers].idPersona,    //identificador de la persona en PEF_tb_personaFisica
    //                isEmployee: false,
    //                name: myUtils.capitalize(normalizeForSearch(name)),
    //                cardId: self._importDataCache.customers[currentIndexCustomers].docNumero,
    //                email: myUtils.stringFormatCSharp("{0}@something.com", new Array(6).join(currentIndexCustomers.toString()))
    //            })
    //            .save(function (err, employeeSaved, numAffected) {

    //                dataCustomerSave(currentIndexCustomers + 1);

    //            });
    //        }

    //    };
    //    dataEmployeeSave = function (currentIndex) {

    //        console.log("Import set employee->" + currentIndex);

    //        if (currentIndex >= self._importDataCache.employees.length) {
    //            dataCustomerSave(0);
    //        }
    //        else {

    //            var name = self._importDataCache.employees[currentIndex].apellido1 + ' ' +
    //                       self._importDataCache.employees[currentIndex].apellido2 + ' , ' +
    //                       self._importDataCache.employees[currentIndex].nombre;

    //            new HelpdeskPeopleModel({
    //                //idPeople: j,      // -> identity (1,1)
    //                //idPersonBackOffice: self._importDataCache.employees[currentIndex].idEmpleado,    //identificaador de la persona en ORG_TB_EMLPEADOS
    //                idPersonBackOffice: self._importDataCache.employees[currentIndex].idPersona,    //identificaador de la persona en PEF_Tb_PersonaFisica aunque sea un emepleado
    //                isEmployee: true,
    //                name: myUtils.capitalize(normalizeForSearch(name)),
    //                cardId: self._importDataCache.employees[currentIndex].docNumero,
    //                email: myUtils.stringFormatCSharp("{0}@something.com", new Array(6).join(currentIndex.toString()))
    //            })
    //            .save(function (err, employeeSaved, numAffected) {

    //                dataEmployeeSave(currentIndex + 1);

    //            });
    //        }

    //    };


    //    dataEmployeeSave(0);

    //    //    }
    //    //});

    //};
    //HelpdeskAPIController.prototype.importAll = function (pageSize, cb) {

    //    var self = this;

    //    if (self._importDataCache.isEmpty === true) {
    //        self.importGetData(pageSize, function (e, getDataResult) {

    //            if (e) return cb(e);

    //            self.importSetData(function (e, setDataResult) {

    //                if (e) return cb(e);

    //                cb(e, setDataResult);
    //            });
    //        });
    //    }
    //    else {
    //        self.importSetData(function (e, setDataResult) {
    //            cb(e, setDataResult);
    //        });
    //    }

    //};


    HelpdeskAPIController.prototype.testMethodInitDb = function (cb) {

        if (this._isInTestMode === true) {
            this.apiRequest('/api/manager/testMethodInitDb/', cb);
        }
        else {
            return cb(new ErrorHandledModel(i18n.__("GeneralTexts.NotImplemented")));
        }
    };
    HelpdeskAPIController.prototype.talkSearch = function (req, params, cb) {

        var self = this;

        if (!req.user.isEmployee) {
            self._talkSearchByCustomer(req, params, cb);
        }
        else {
            self._talkSearchByEmployee(req, params, cb);
        }

    };
    HelpdeskAPIController.prototype.talkAdd = function (req, dataItem, cb) {

        var self = this;

        console.log(dataItem);
        console.log(req);

        this._employeeDefaultGet(req.user.idPeople, function (e, employeeDefault) {

            if (e) return cb(e, null);

            self._talkSave(
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
    };
    HelpdeskAPIController.prototype.messageAdd = function (req, dataItem, cb) {


        var self = this;
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

            self._userRequestCanAccessTalk(req, dataItem.idTalk,
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

                                        self._userLastWriteUpdate({
                                            idTalk: messageObject.idTalk,
                                            idPeople: messageObject.idPeople,
                                            idMessage: messageObject.idMessage,
                                            dateWrite: new Date()
                                        }, function (e, lastWriteUpdate, lastWriteNumberAffected) {

                                            if (e) return cb(e, null);

                                            dataResult = new DataResult(true, "", messageObject);

                                            cb(null, dataResult);

                                        });
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
    };
    HelpdeskAPIController.prototype.messageGetAll = function (req, params, cb) {

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

        //var filter = params;
        var self = this;
        var idTalk = params.filter.idTalk;

        this._userRequestCanAccessTalk(req, idTalk, function (e, hasPermission, peopleInvolvedDetails) {

            if (e) return cb(e, null);

            if (hasPermission) {

                HelpdeskMessageModel.find({
                    idTalk: idTalk
                }, function (e, messagesByIdTalk) {

                    self._messageResultToViewModel(
                        req,
                        params,
                        peopleInvolvedDetails,
                        messagesByIdTalk,
                        function (e, dataResult) {

                            if (e) return cb(e, null);

                            var newMessageRead = _.last(messagesByIdTalk);

                            if (newMessageRead) {
                                self._userLastReadUpdate({
                                    idTalk: idTalk,
                                    idPeople: req.user.idPeople,
                                    idMessage: newMessageRead.idMessage,
                                    dateRead: new Date()
                                }, function (e, talkObject, numberAffected) {
                                    cb(null, dataResult);
                                });
                            }
                            else {
                                cb(null, dataResult);
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

    };
    HelpdeskAPIController.prototype.messageGetUnread = function (req, params, cb) {

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

        var self = this;
        var filter = params;
        var idTalk = filter.filter.idTalk;
        var idMessageLastRead = filter.filter.idMessageLastRead;

        this._userRequestCanAccessTalk(req, idTalk, function (e, hasPermission, peopleInvolvedDetails) {

            if (e) return cb(e, null);

            if (hasPermission) {

                var messageGetUnReadFromFilter = function (messageModelFilter) {


                    HelpdeskMessageModel.find(messageModelFilter,
                        function (e, messagesByIdTalk) {


                            var returnResult = function () {

                                self._messageResultToViewModel(
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
                                self._userLastReadUpdate({
                                    idTalk: idTalk,
                                    idPeople: req.user.idPeople,
                                    idMessage: newMessageRead.idMessage,
                                    dateRead: new Date()
                                }, function (e, talkObject, numberAffected) {
                                    returnResult();
                                });
                            }
                            else {
                                returnResult();
                            }
                        });


                };

                var messageModelFilter = {
                    idTalk: idTalk,
                    idPeople: {
                        $ne: req.user.idPeople
                    },
                    datePosted: { $gt: new Date(1900, 1, 1) }
                };

                if (idMessageLastRead !== undefined) {

                    HelpdeskMessageModel.findOne({
                        idMessage: idMessageLastRead
                    }, function (e, lastMessageRead) {

                        if (e) return cb(e, null);

                        if (lastMessageRead !== null) {
                            messageModelFilter.datePosted = { $gt: lastMessageRead.datePosted };
                        }

                        messageGetUnReadFromFilter(messageModelFilter);

                    });

                }
                else {
                    messageGetUnReadFromFilter(messageModelFilter);
                }

            }
            else {
                var dataResult = new DataResultPaginated();
                dataResult.isValid = false;
                dataResult.addMessage(req.i18n.__("GeneralTexts.PermissionDenied"));
                cb(null, dataResult);
            }
        });
    };
    /************************************************************
                        Methods for employee
    *************************************************************/
    HelpdeskAPIController.prototype.talkGetById = function (req, dataItem, cb) {

        var dataResult = null;


        this._fakeDataGridTalkGetByIdForEdit(req, dataItem.idTalk,
            function (e, dataResult) {
                if (e) return cb(error, null);

                cb(null, dataResult);

            });
    };
    HelpdeskAPIController.prototype.talkSavedByEmployee = function (req, dataItem, cb) {

        var self = this;

        this._talkSave(
            req.i18n,
            dataItem.isNew === true ? null : dataItem.formData.idTalk,
            dataItem.formData.subject,
            dataItem.formData.customerInfo.customerId,  // customerId
            req.user.idPeople, // employeeId
            function (e, dataResult) {

                if (e) return cb(e, null);

                if (dataResult.isValid === true) {
                    self._fakeDataGridTalkGetByIdForEdit(
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
    };
    HelpdeskAPIController.prototype.customerSearch = function (req, params, cb) {

        var dbFilter = { isEmployee: false };

        if ((params.filter.customerName) && (params.filter.customerName.trim() !== "")) {
            // this reg ex is some kind of search like this-> "%word1% AND %word2%"

            //(?=.*\bjordi\b)(?=.*\bvila\b).+

            var words = params.filter.customerName.trim().replace('.', '').split(' ');
            var str = '';
            for (var i = 0; i < words.length; i++) {
                str += '(?=.*\\b' + normalizeForSearch(words[i]) + '\\b)';
            }

            dbFilter.name = new RegExp(str, "ig");
        }

        if ((params.filter.customerCardId) && (params.filter.customerCardId.trim() !== "")) {
            dbFilter.cardId = new RegExp(myUtils.stringFormatCSharp('{0}', params.filter.customerCardId), "i");
        }

        console.log(dbFilter);

        this._searchPeoplePaginated(
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

    };
    HelpdeskAPIController.prototype.employeeSearch = function (req, params, cb) {

        var dbFilter = { isEmployee: true };

        if ((params.filter.employeeName) && (params.filter.employeeName.trim() !== "")) {
            // this reg ex is some kind of search like this-> "%word1% AND %word2%"

            //(?=.*\bjordi\b)(?=.*\bvila\b).+
            var words = params.filter.employeeName.trim().split(' ');
            var str = '';
            for (var i = 0; i < words.length; i++) {
                str += '(?=.*\\b' + normalizeForSearch(words[i]) + '\\b)';
            }

            dbFilter.name = new RegExp(str, "ig");
        }

        if ((params.filter.employeeEmail) && (params.filter.employeeEmail.trim() !== "")) {
            dbFilter.email = new RegExp(myUtils.stringFormatCSharp('{0}', params.filter.employeeEmail), "i");
        }

        this._searchPeoplePaginated(
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
    };

})(module);