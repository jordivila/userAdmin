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
    HelpdeskAPIController.prototype._talkSearchByCustomer = function (req, params, cb) {


        var path = "talkSearchByCustomer";
        path += "/" + req.user.idPeople;
        path += "/" + params.page;
        path += "/" + params.pageSize;

        apiRequest(req.i18n, path, function (e, data) {

            cb(e, data);
        });
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

        if (params.filter.lastMessageStatus) {
            path += "?lastMsgStatus=" + params.filter.lastMessageStatus;
        }



        apiRequest(req.i18n, path, function (e, data) {
            cb(e, data);
        });
    };
    HelpdeskAPIController.prototype._fakeDataGridTalkGetByIdForEdit = function (req, idTalk, cb) {

        var path = "talkGetByIdForEdit/" + req.user.idPeople + "/" + idTalk;

        apiRequest(req.i18n, path, function (e, data) {
            cb(e, data);
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
        var path = 'authTicketValidateFullApi/';
        path += req.cookies.oAuthTicket;

        apiRequest(i18n, path, function (e, authTicket) {

            if (e) return callback(e, null);

            if (authTicket === null) {
                invalidCredentials();
            }
            else {

                var setPeopleInfo = function () {

                    callback(null, authTicket);

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

        apiRequestPost(req.i18n, "messageAdd/",
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

        apiRequestPost(req.i18n, "talkSave/",
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

    };

})(module);