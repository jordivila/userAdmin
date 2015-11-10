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

    //var HelpdeskTalkModel = require('../models/helpdesk').HelpdeskTalk;
    //var HelpdeskPeopleModel = require('../models/helpdesk').HelpdeskPeople;
    //var HelpdeskMessageModel = require('../models/helpdesk').HelpdeskMessage;
    //var HelpdeskPeopleLastReadModel = require('../models/helpdesk').HelpdeskPeopleLastRead;
    //var HelpdeskPeopleLastWriteModel = require('../models/helpdesk').HelpdeskPeopleLastWrite;
    //var HelpdeskPeopleInvolvedModel = require('../models/helpdesk').HelpdeskPeopleInvolved;


    function apiRequestOptions() {
        //path = "/ArquiaXXI.BackOffice.WCF.Services/HelpdeskServices/HelpdeskService.svc/wb/" + path;

        //var options = {
        //    host: 'localhost',
        //    port: 80,
        //    path: path,
        //    method: 'GET',
        //    headers: {
        //        //'Content-Type': 'application/x-www-form-urlencoded',
        //        'Content-Type': 'application/json; charset=utf-8',
        //        //'Content-Length': postData.length
        //    },
        //};

        //path = "/Arquia.WCF/ArquiaXXI.BackOffice.WCF.Services/HelpdeskServices/HelpdeskService.svc/wb/" + path;

        //var options = {
        //    host: '77.0.11.220',
        //    port: 80,
        //    path: path,
        //    method: 'GET',
        //    headers: {
        //        //'Content-Type': 'application/x-www-form-urlencoded',
        //        'Content-Type': 'application/json; charset=utf-8',
        //        //'Content-Length': postData.length
        //    },
        //};




        return {
            host: config.get('helpdesk:api:host'),
            port: config.get('helpdesk:api:port'),
            path: config.get('helpdesk:api:basePath'),
            method: 'GET',
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/json; charset=utf-8',
                //'Content-Length': postData.length
            },
        };
    }
    function apiRequest(i18n, path, cb) {
        var options = apiRequestOptions();
        options.path = options.path + path;

        var bufferJson = "";
        var reqClient = http.request(options, function (res) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                bufferJson += chunk;
            });
            res.on('end', function () {

                

                if (res.statusCode !== 200) {

                    //console.log(res);
                    //console.log(res.statusCode);

                    //cb(new ErrorHandledModel(i18n.__("Views.Layout.UnExpectedError"), res), null);
                    cb(new ErrorHandledModel("Helpdesk API ->" + i18n.__("Views.Layout.UnExpectedError")), null);
                }
                else {
                    cb(null, JSON.parse(bufferJson));
                }
            });
        });

        reqClient.on('error', function (e) {
            cb(e, null);
        });

        reqClient.end();
    }
    function apiRequestPost(i18n, path, params, cb) {

        var options = apiRequestOptions();
        options.method = 'POST';
        options.path = options.path + path;

        var bufferJson = "";
        var reqClient = http.request(options, function (res) {
            //console.log('STATUS: ' + res.statusCode);
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                bufferJson += chunk;
            });
            res.on('end', function () {

                if (res.statusCode !== 200) {

                    //console.log(res);

                    //cb(new ErrorHandledModel(i18n.__("Views.Layout.UnExpectedError"), res), null);
                    cb(new ErrorHandledModel("Helpdesk API ->" + i18n.__("Views.Layout.UnExpectedError")), null);
                }
                else {
                    cb(null, JSON.parse(bufferJson));
                }
            });
        });

        reqClient.on('error', function (e) {
            cb(e, null);
        });


        reqClient.write(JSON.stringify(params));
        reqClient.end();
    }

    function HelpdeskAPIController() {
        passport.use('helpdeskStrategy', new BasicStrategy({ passReqToCallback: true }, this.reqCredentialsCheck));
    }


    HelpdeskAPIController.prototype._employeeDefaultGet = function (i18n, customerIdPeople, cb) {

        var self = this;

        apiRequest(i18n, "employeeGetDefaultByIdPeople/" + customerIdPeople,
            function (e, employeeDefaultId) {

                if (e) return cb(e, null);

                cb(null, employeeDefaultId);

            });

    };
    HelpdeskAPIController.prototype._talkSave = function (i18n, idTalk, subject, customerId, employeeId, cb) {

        apiRequestPost(i18n, "talkSave/",
            {
                idTalk: idTalk,
                subject: subject,
                customerId: customerId,
                employeeId: employeeId
            }, function (e, data) {

                cb(e, data);
            });

    };

    HelpdeskAPIController.prototype._talkGetPeopleInvolved = function (idTalk, cb) {

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

    };
    HelpdeskAPIController.prototype._talkSearchByCustomer = function (req, params, cb) {


        var path = "talkSearchByCustomer";
        path += "/" + req.user.idPeople;
        path += "/" + params.page;
        path += "/" + params.pageSize;



        apiRequest(req.i18n, path, function (e, data) {

            cb(e, data);
        });

        //HelpdeskPeopleInvolvedModel.find({
        //    idPeople: req.user.idPeople
        //},
        //function (err, data) {

        //    if (err) return cb(err);

        //    self._talkSearchDataToViewModel(
        //        req.user,
        //        _.map(data, function (value, index, list) {
        //            return value.idTalk;
        //        }),
        //        params,
        //        cb);
        //});

    };
    HelpdeskAPIController.prototype._talkSearchByEmployee = function (req, params, cb) {


        var self = this;
        var dbFilter = {};
        var isEmployeeAdmin = false;// by the time I write this line no admin users exists. So hardcode this value
        var peopleInvolvedFilter = [];
        var customerId = function () {

            if ((params.filter.customerInfo) && (params.filter.customerInfo.customerId !== "")) {
                return params.filter.customerInfo.customerId;
            }
            else {
                return null;
            }

        }();
        var employeeId = function () {

            if (isEmployeeAdmin === true) {
                if ((params.filter.employeeInfo) && (params.filter.employeeInfo.employeeId !== "")) {
                    // comprobar si tiene permisos para buscar por otro empleado. Debe ser super user o admin ...
                    return params.filter.employeeInfo.employeeId;
                }
                else {
                    return null;// es employee admin y esta buscando conversaciones de cualquier empleado
                }
            }
            else {
                // en caso de que no sea super user. Añadir el filtro de empleado
                return req.user.idPeople;
            }

        }();

        if (employeeId !== null) peopleInvolvedFilter.push(employeeId);
        if (customerId !== null) peopleInvolvedFilter.push(customerId);

        var path = "talkSearchByEmployee";
        path += "/" + req.user.idPeople;
        path += "/" + peopleInvolvedFilter.join('-');
        path += "/" + params.page;
        path += "/" + params.pageSize;
        path += "/";

        if (params.filter.lastMessageStatus)
        {
            path += "?lastMsgStatus=" + params.filter.lastMessageStatus;
        }

        

        apiRequest(req.i18n, path, function (e, data) {
            cb(e, data);
        });



        //HelpdeskPeopleInvolvedModel.aggregate(
        //   [
        //       // filter talks by idPeople IN...
        //       // This means ... idPeople == customerId || idPeople == employeeId
        //       { $match: { idPeople: { $in: peopleInvolvedFilter } } },
        //       // group those by idTalk
        //       { $group: { _id: "$idTalk", people: { $push: "$idPeople" } } },
        //       // add peopleCount field
        //       {
        //           $project: {
        //               _id: 0,
        //               idTalk: "$_id",
        //               people: 1,
        //               peopleCount: { $size: "$people" }
        //           }
        //       },
        //       // filter results getting only those elements 
        //       // containing $all items in the source array in the destination array
        //       // This means ... groupedPeople [1,2,3] == destionationArray.[3,1,2]
        //       { $match: { people: { $all: peopleInvolvedFilter } } },
        //   ]
        //).exec(function (e, data) {

        //    var talkIdsArray = _.map(data, function (value, index, list) {
        //        return value.idTalk;
        //    });

        //    self._talkSearchDataToViewModel(req.user, talkIdsArray, params, cb);


        //});

    };
    HelpdeskAPIController.prototype._talkSearchDataToViewModel = function (requestIdentityUser, talkIdsArray, params, cb) {

        HelpdeskPeopleLastWriteModel
            .find({
                idTalk: { $in: talkIdsArray },
                idPeople: requestIdentityUser.idPeople // used to track number of unRead Messages
            }, function (e, userLastMessageWrites) {

                if (e) return cb(e, null);

                HelpdeskPeopleLastReadModel
                    .find({
                        idTalk: { $in: talkIdsArray },
                        idPeople: requestIdentityUser.idPeople // used to track number of unRead Messages
                    }, function (e, userLastMessageReads) {

                        if (e) return cb(e, null);

                        HelpdeskMessageModel.aggregate([
                           { $match: { idTalk: { $in: talkIdsArray } } },
                           // group those by idTalk
                           {
                               $group: {
                                   _id: "$idTalk",
                                   messages: { $push: "$$ROOT" }
                               },
                           },
                           {
                               $project: {
                                   _id: 0,
                                   idTalk: "$_id",
                                   messages: 1,
                               },
                           },
                        ])
                        .exec(function (e, groupedMessages) {

                            if (e) return cb(e, null);


                            if (params.filter.lastMessageStatus) {

                                var idTalksToRemove = [];

                                _.each(groupedMessages, function (elem, index, list) {

                                    var idTalk = elem.idTalk;
                                    var lastTalkMessage = _.last(elem.messages);
                                    var lastDateUserRead = function () {
                                        var foundLastReadRow = _.find(userLastMessageReads, function (elemLastRead) {
                                            return (elemLastRead.idTalk == idTalk);
                                        });

                                        if (foundLastReadRow) {
                                            return foundLastReadRow.dateRead;
                                        }
                                        else {
                                            return new Date(1900, 1, 1);
                                        }
                                    }();
                                    var lastDateUserWrite = function () {
                                        var foundLastWriteRow = _.find(userLastMessageWrites, function (elemLastWrite) {
                                            return (elemLastWrite.idTalk == idTalk);
                                        });

                                        if (foundLastWriteRow) {
                                            return foundLastWriteRow.dateWrite;
                                        }
                                        else {
                                            return new Date(1900, 1, 1);
                                        }
                                    }();



                                    var userReadAllMessages = (lastDateUserRead >= lastTalkMessage.datePosted) || (lastTalkMessage.idPeople == requestIdentityUser.idPeople);
                                    var userAnsweredLast = lastDateUserWrite >= lastTalkMessage.datePosted;

                                    if (params.filter.lastMessageStatus == helpdeskCrossLayer.talkStatus.notRead) {
                                        // Remove from the resultset those items already read
                                        if (userReadAllMessages) {
                                            idTalksToRemove.push(idTalk);
                                        }
                                    }

                                    if (params.filter.lastMessageStatus == helpdeskCrossLayer.talkStatus.pendingAnswer) {
                                        // remove from the resultset those items where last 
                                        // message was posted by someone different than identity user
                                        if (userAnsweredLast) {
                                            idTalksToRemove.push(idTalk);
                                        }
                                    }

                                    if (params.filter.lastMessageStatus == helpdeskCrossLayer.talkStatus.Ok) {

                                    }

                                });



                                if (idTalksToRemove.length > 0) {

                                    talkIdsArray = _.difference(talkIdsArray, idTalksToRemove);


                                }
                            }

                            var page = params.page;
                            var pageSize = params.pageSize;
                            var queryFilter = function () {
                                return {
                                    idTalk: {
                                        $in: talkIdsArray
                                    }
                                };
                            }();
                            var query = HelpdeskTalkModel.find(queryFilter).skip((page * pageSize)).limit(pageSize).sort({ dateLastMessage: 'desc' });
                            var queryCount = HelpdeskTalkModel.find(queryFilter).count();

                            HelpdeskMessageModel
                                .find({
                                    idTalk: { $in: talkIdsArray },
                                }, function (e, allTalkMessages) {

                                    if (e) return cb(e, null);

                                    query.exec(function (e, talkArray) {

                                        if (e) return cb(e, null);

                                        queryCount
                                            .exec(function (e, talkCount) {

                                                if (e) return cb(e, null);

                                                var dataResult = new DataResultPaginated();
                                                dataResult.isValid = true;
                                                dataResult.data.totalRows = talkCount;
                                                dataResult.data.page = page;
                                                dataResult.data.pageSize = pageSize;
                                                dataResult.data.data = _.map(talkArray, function (value, index, list) {
                                                    return {
                                                        idTalk: value.idTalk,
                                                        subject: value.subject,
                                                        dateLastMessage: value.dateLastMessage, // this._fakeMessagesGetDateLastMessage(talkArray[i].idTalk),
                                                        nMessagesUnread: function () {

                                                            var userLastReadMessage = _.find(userLastMessageReads, function (elem) {
                                                                return elem.idTalk == value.idTalk;
                                                            });
                                                            var userLastReadDate = function () {

                                                                if (userLastReadMessage) {
                                                                    return userLastReadMessage.dateRead;
                                                                }
                                                                else {
                                                                    // current user has not been read any message
                                                                    return value.dateCreated;
                                                                }

                                                            }();
                                                            var talkMessages = _.filter(allTalkMessages, function (elem) {
                                                                return elem.idTalk == value.idTalk;
                                                            });
                                                            var talkMessagesUnread = _.filter(talkMessages, function (elem) {
                                                                //return elem.datePosted > userLastReadDate;

                                                                return ((elem.datePosted > userLastReadDate) &&
                                                                        (elem.idPeople !== requestIdentityUser.idPeople));
                                                            });

                                                            return talkMessagesUnread.length;
                                                        }()
                                                    };
                                                });

                                                cb(null, dataResult);
                                            });
                                    });
                                });
                        });
                    });
            });
    };
    HelpdeskAPIController.prototype._fakeMessageObjectToViewModel = function (currentUserIdPeople, peopleInvolvedDetailsArray, message) {

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

    };
    HelpdeskAPIController.prototype._userCanAccessTalk = function (idPeople, idTalk, cb) {

        this._talkGetPeopleInvolved(idTalk,
            function (e, peopleInvolved) {

                if (e) return cb(e, null);

                var evens = _.filter(peopleInvolved, function (element) { return element.idPeople == idPeople; });

                cb(null, evens.length > 0, peopleInvolved);

            });
    };
    HelpdeskAPIController.prototype._userRequestCanAccessTalk = function (req, idTalk, cb) {
        this._userCanAccessTalk(req.user.idPeople, idTalk, cb);
    };
    HelpdeskAPIController.prototype._userLastReadUpdate = function (model, cb) {

        //new HelpdeskPeopleLastReadModel({
        //    idTalk: idTalk,
        //    idPeople: req.user.idPeople,
        //    idMessage: newMessageRead.idMessage,
        //    dateRead: new Date()
        //}).save(function (e, talkObject, numberAffected) {
        //    returnResult();
        //});



        HelpdeskPeopleLastReadModel.findOne({
            idTalk: model.idTalk,
            idPeople: model.idPeople
        }, function (e, lastRead) {

            if (e) return cb(e, null);

            if (lastRead) {

                HelpdeskPeopleLastReadModel
                    .findByIdAndUpdate(
                        lastRead._id,
                        {
                            $set: {
                                idMessage: model.idMessage,
                                dateRead: model.dateRead
                            }
                        },
                        function (e, lastReadUpdated) {
                            if (e) return cb(e, null);

                            cb(null, lastReadUpdated, 1);
                        });

            } else {

                new HelpdeskPeopleLastReadModel(model)
                    .save(function (e, lastReadObject, numberAffected) {

                        if (e) return cb(e, null);

                        cb(null, lastReadObject, numberAffected);

                    });
            }
        });
    };
    HelpdeskAPIController.prototype._userLastWriteUpdate = function (model, cb) {

        //new HelpdeskPeopleLastReadModel({
        //    idTalk: idTalk,
        //    idPeople: req.user.idPeople,
        //    idMessage: newMessageRead.idMessage,
        //    dateWrite: new Date()
        //}).save(function (e, talkObject, numberAffected) {
        //    returnResult();
        //});


        HelpdeskPeopleLastWriteModel.findOne({
            idTalk: model.idTalk,
            idPeople: model.idPeople
        }, function (e, lastWrite) {

            if (e) return cb(e, null);

            if (lastWrite) {

                HelpdeskPeopleLastWriteModel
                    .findByIdAndUpdate(
                        lastWrite._id,
                        {
                            $set: {
                                idMessage: model.idMessage,
                                dateWrite: model.dateWrite
                            }
                        },
                        function (e, lastWriteUpdated) {
                            if (e) return cb(e, null);

                            cb(null, lastWriteUpdated, 1);
                        });


            } else {
                new HelpdeskPeopleLastWriteModel(model)
                    .save(function (e, lastWriteObject, numberAffected) {

                        if (e) return cb(e, null);

                        cb(null, lastWriteObject, numberAffected);

                    });
            }
        });
    };
    HelpdeskAPIController.prototype._messageResultToViewModel = function (req, filter, peopleInvolvedDetails, messageArray, cb) {

        var dataResult = new DataResultPaginated();

        for (var i = (filter.page * filter.pageSize) ; i < ((filter.page * filter.pageSize) + filter.pageSize) ; i++) {
            if (i < messageArray.length) {
                dataResult.data.data.push(this._fakeMessageObjectToViewModel(req.user.idPeople, peopleInvolvedDetails, messageArray[i]));
            }
        }


        dataResult.isValid = true;
        dataResult.data.totalRows = messageArray.length;
        dataResult.data.page = filter.page;
        dataResult.data.pageSize = filter.pageSize;

        cb(null, dataResult);
    };
    HelpdeskAPIController.prototype._fakeDataGridTalkGetByIdForEdit = function (req, idTalk, cb) {


        var path = "talkGetByIdForEdit/" + req.user.idPeople + "/" + idTalk;

        apiRequest(req.i18n, path, function (e, data) {

            cb(e, data);
        });


        //try {


        //    var self = this;
        //    var i18n = req.i18n;
        //    var dataResult = null;

        //    HelpdeskTalkModel.findOne({
        //        idTalk: idTalk
        //    }, function (e, talk) {

        //        if (e) return cb(e, null);

        //        if (talk === null) {
        //            cb(null, new DataResult(false, i18n.__("Helpdesk.Talks.TalkNotFound")));
        //        }
        //        else {

        //            self._userRequestCanAccessTalk(req, idTalk,
        //                function (e, hasPermission, peopleInvolved) {

        //                    if (e) return cb(e, null);

        //                    var customerInfo = function () {
        //                        for (var i = 0; i < peopleInvolved.length; i++) {
        //                            if (peopleInvolved[i].isEmployee === false) {
        //                                return {
        //                                    customerId: peopleInvolved[i].idPeople,
        //                                    customerName: peopleInvolved[i].name
        //                                };
        //                            }
        //                        }
        //                        return null;
        //                    }();


        //                    //var dataObj = myUtils.extendDeep({}, talk);
        //                    var dataObj = {
        //                        idTalk: talk.idTalk,
        //                        subject: talk.subject,
        //                        dateLastMessage: talk.dateLastMessage,
        //                        editData: {
        //                            idTalk: talk.idTalk,
        //                            subject: talk.subject,
        //                            dateLastMessage: talk.dateLastMessage,
        //                            customerInfo: customerInfo
        //                        }
        //                    };

        //                    cb(null, new DataResult(true, "", dataObj));
        //                });
        //        }
        //    });

        //}
        //catch (e) {
        //    cb(e, null);
        //}
    };
    HelpdeskAPIController.prototype._searchPeoplePaginated = function (mongooseFilter, page, pageSize, mapItemCallback, cb) {

        var query = HelpdeskPeopleModel.find(mongooseFilter);
        var queryCount = HelpdeskPeopleModel.find(mongooseFilter).count();

        query
            .skip((page * pageSize))
            .limit(pageSize)
            .sort({ name: 'asc' })
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
    };
    HelpdeskAPIController.prototype.reqCredentialsCheck = function (req, username, password, callback) {


        var self = this;
        var i18n = req.i18n;

        var invalidCredentials = function () {
            callback(null, false, {
                message: i18n.__("AccountResources.InvalidCredentials")
            });
        };

        // some api routes are for customers
        // and another ones are for employees only
        // this methods returns tru if api route for the current request
        // was a customer route
        // See /src/backend/routing/routesApiUser.js
        var path = 'authTicketValidate/';
        path += req.cookies.oAuthTicket;

        apiRequest(i18n, path, function (e, authTicket) {

            if (e) return callback(e, null);

            if (authTicket === null) {
                invalidCredentials();
            }
            else {

                var setPeopleInfo = function () {
                    HelpdeskPeopleModel.findOne({
                        idPersonBackOffice: authTicket.idPersonBackOffice,
                        isEmployee: authTicket.isEmployee
                    }, function (err, peopleInfo) {

                        if (err) return callback(err, null);

                        if (peopleInfo === null) {
                            invalidCredentials();
                        }
                        else {
                            callback(null, peopleInfo);
                        }

                    });
                };

                if (req.params.apiEndpointType === 'customer') {

                    if (authTicket.isEmployee === true) {
                        // Un usuario empleado esta intentando entrar en la seccion de customers
                        invalidCredentials();
                    }
                    else {
                        setPeopleInfo();
                    }

                }
                else {

                    if (authTicket.isEmployee === false) {
                        // Un usuario customer esta intentando entrar en la seccion de empleados
                        invalidCredentials();
                    }
                    else {
                        setPeopleInfo();
                    }

                }
            }
        });

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



    HelpdeskAPIController.prototype.testMethodInitDb = function (i18n, cb) {
        apiRequest(i18n, "testMethodInitDb", function (e, data) {
            cb(e, data);
        });
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

        this._employeeDefaultGet(req.i18n, req.user.idPeople, function (e, employeeDefault) {

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

                        var talkDetail = dataResult.data.talkObject;
                        dataItem.editData = talkDetail;
                        dataItem.formData = undefined;
                        dataResult.data = dataItem;

                        cb(null, dataResult);
                    }
                    else {
                        cb(null, dataResult);
                    }

                });
        });
    };
    HelpdeskAPIController.prototype.messageAdd = function (req, dataItem, cb) {

        apiRequestPost(i18n, "messageAdd/",
            {
                idTalk: dataItem.idTalk,
                message: dataItem.message,
                whoPosted: req.user.idPeople
            }, function (e, data) {

                if (e) return cb(e, null);

                if (data.isValid === true) {
                    var temp = data.data.data;
                    data.data = temp;
                    cb(e, data);
                }
                else {
                    cb(e, data);
                }
            });
    };
    HelpdeskAPIController.prototype.messageGetAll = function (req, params, cb) {

        var path = "messagesGetAll/" + params.filter.idTalk + "/" + req.user.idPeople + "/0/10000";

        apiRequest(req.i18n, path, function (e, data) {
            cb(e, data);
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

        var path = "messagesGetUnread/" + params.filter.idTalk + "/" + req.user.idPeople + "/" + params.filter.idMessageLastRead + "/0/10000";



        apiRequest(req.i18n, path, function (e, data) {
            cb(e, data);
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


        apiRequestPost(i18n, "talkSave/",
            {
                idTalk: dataItem.isNew === true ? null : dataItem.formData.idTalk,
                subject: dataItem.formData.subject,
                customerId: dataItem.formData.customerInfo.customerId,
                employeeId: req.user.idPeople
            }, function (e, dataResult) {


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



        //this._talkSave(
        //    req.i18n,
        //    dataItem.isNew === true ? null : dataItem.formData.idTalk,
        //    dataItem.formData.subject,
        //    dataItem.formData.customerInfo.customerId,  // customerId
        //    req.user.idPeople, // employeeId
        //    function (e, dataResult) {

        //        if (e) return cb(e, null);

        //        if (dataResult.isValid === true) {
        //            self._fakeDataGridTalkGetByIdForEdit(
        //                req,
        //                dataResult.data.idTalk,
        //                function (e, dataResultGetById) {

        //                    if (e) return cb(e, null);

        //                    if (dataResultGetById.isValid) {
        //                        // ponemos en el mensaje de salida
        //                        // el mensaje resultado de guardar
        //                        dataResultGetById.messages[0] = dataResult.messages[0];
        //                    }

        //                    cb(null, dataResultGetById);
        //                });
        //        }
        //        else {
        //            cb(null, dataResult);
        //        }
        //    });
    };
    HelpdeskAPIController.prototype.customerSearch = function (req, params, cb) {

        var path = "customerSearch/" +
                    req.user.idPeople + "/" +
                    params.page + "/" +
                    params.pageSize + "/" +
                    "?name=" + encodeURIComponent(params.filter.customerName) + "&" +
                    "cardId=" + encodeURIComponent(params.filter.customerCardId);

        apiRequest(req.i18n, path, function (e, data) {
            cb(e, data);
        });


        //this._searchPeoplePaginated(
        //    dbFilter,
        //    params.page,
        //    params.pageSize,
        //    function (value, index, list) {
        //        return {
        //            customerCardId: value.cardId,
        //            customerId: value.idPeople,
        //            customerName: value.name
        //        };
        //    },
        //    cb);

    };
    HelpdeskAPIController.prototype.employeeSearch = function (req, params, cb) {

        var path = "employeeSearch/" +
                    req.user.idPeople + "/" +
                    params.page + "/" +
                    params.pageSize + "/" +
                    "?name=" + encodeURIComponent(params.filter.employeeName) + "&" +
                    "email=" + encodeURIComponent(params.filter.employeeEmail);

        

        apiRequest(req.i18n, path, function (e, data) {
            cb(e, data);
        });


        //var dbFilter = { isEmployee: true };

        //if ((params.filter.employeeName) && (params.filter.employeeName.trim() !== "")) {
        //    // this reg ex is some kind of search like this-> "%word1% AND %word2%"

        //    //(?=.*\bjordi\b)(?=.*\bvila\b).+
        //    var words = params.filter.employeeName.trim().replace('.', '').replace(',', '').trim().split(' ');

        //    var str = '';
        //    for (var i = 0; i < words.length; i++) {
        //        str += '(?=.*\\b' + normalizeForSearch(words[i]) + '\\b)';
        //    }

        //    dbFilter.name = new RegExp(str, "ig");
        //}

        //if ((params.filter.employeeEmail) && (params.filter.employeeEmail.trim() !== "")) {
        //    dbFilter.email = new RegExp(myUtils.stringFormatCSharp('{0}', params.filter.employeeEmail), "i");
        //}

        //this._searchPeoplePaginated(
        //    dbFilter,
        //    params.page,
        //    params.pageSize,
        //    function (value, index, list) {

        //        return {
        //            employeeId: value.idPeople,
        //            employeeName: value.name,
        //            employeeEmail: value.email
        //        };

        //    },
        //    cb);
    };

})(module);