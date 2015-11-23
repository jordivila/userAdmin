(function (module) {

    "use strict";


    module.exports.isAuthenticated = reqIsAuthenticated;
    module.exports.HelpdeskAPIController = HelpdeskAPIController;
    module.exports.HelpdeskViewAuthController = HelpdeskViewAuthController;
    module.exports.HelpdeskViewMessageController = HelpdeskViewMessageController;
    module.exports.HelpdeskViewLoadDataController = HelpdeskViewLoadDataController;


    var passport = require('passport');
    var LocalStretegy = require('passport-local').Strategy;

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
    var GenericViewController = require('./classes/genericView');
    var HelpdeskBaseController = require('./HelpdeskBase').HelpdeskBaseController;
    var HelpdeskUserType = require('./HelpdeskBase').HelpdeskUserType;
    var passportStrategyName = "helpdeskStrategyViews";



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


        //console.log(JSON.stringify(params));

        reqClient.write(JSON.stringify(params));
        reqClient.end();
    }
    function reqCredentialsCheckViews(req, username, password, callback) {

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
                callback(null, false, {
                    message: i18n.__("AccountResources.InvalidCredentials")
                });
            }
            else {

                var setPeopleInfo = function () {
                    callback(null, authTicket);
                };

                if (req.params.apiEndpointType === HelpdeskUserType.customer) {

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
    }
    function reqIsAuthenticated(req, res, next) {

        if (req.method == "GET") {
            req.query.fakeEmailLocalStrategy = 'fakeEmail@kk.com';
            req.query.fakePwdLocalStrategy = 'fakepassword';
        }
        else {
            req.body.fakeEmailLocalStrategy = 'fakeEmail@kk.com';
            req.body.fakePwdLocalStrategy = 'fakepassword';
        }

        return passport.authenticate(
            passportStrategyName,
            function (err, user, info) {

                if (err) {
                    return next(err);
                }

                if (!user) {

                    var isSeoRequest = req.viewModel === undefined ? false : req.viewModel.isSEORequest;

                    if (!isSeoRequest) {
                        res.status(401);
                        res.end();
                    }
                    else {
                        res.redirect('../unauthorize/');
                    }
                }
                else {
                    req.user = user;
                    next();
                }

            })(req, res, next);

    }


    // these strategies should be of type custom strategy. 
    // to make it faster I used LocalStregy simulating fake user/pwd credentials
    // as far as credentials are set by thirdparty application by using an OAuth token
    passport.use(passportStrategyName, new LocalStretegy({
        passReqToCallback: true,
        session: false,
        usernameField: 'fakeEmailLocalStrategy',
        passwordField: 'fakePwdLocalStrategy',
    }, reqCredentialsCheckViews));

    function HelpdeskAPIController() {
        HelpdeskBaseController.apply(this, arguments);
    }
    HelpdeskAPIController.prototype = new HelpdeskBaseController();
    HelpdeskAPIController.prototype._employeeDefaultGet = function (i18n, customerIdPeople, cb) {

        var self = this;



        apiRequest(i18n, "employeeGetDefaultByIdPeople/" + customerIdPeople,
            function (e, employeeDefault) {

                if (e) return cb(e, null);


                cb(null, employeeDefault);

            });

    };
    HelpdeskAPIController.prototype._talkSave = function (i18n, idTalk, subject, customerId, employeeId, cb) {


        apiRequestPost(i18n, "talkSave/",
            {
                idTalk: idTalk,
                subject: subject,
                customerId: customerId === '' ? null : customerId,
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
    HelpdeskAPIController.prototype.testMethodInitDb = function (i18n, cb) {
        apiRequest(i18n, "testMethodInitDb", function (e, data) {
            cb(e, data);
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



    function HelpdeskViewAuthController() {
        GenericViewController.apply(this, arguments);
    }
    HelpdeskViewAuthController.prototype = new GenericViewController();
    HelpdeskViewAuthController.prototype.viewIndexModelDone = function (req, res, cb) {
        if (req.viewModel.isSEORequest) {
            res.writeHead(301,
              {
                  Location: '../home/'
              }
            );
            res.end();
        }
        else {
            cb(null, {
                location: '../home/'
            });
        }
    };
    HelpdeskViewAuthController.prototype.viewIndexModel = function (req, res, cb) {

        if (req.query.oAuthTicket) {
            this.setCookie(res, "oAuthTicket", req.query.oAuthTicket);
        }

        this.viewIndexModelDone(req, res, cb);

    };

    function HelpdeskViewMessageController() {
        this.helpdeskApiController = new HelpdeskAPIController();
        GenericViewController.apply(this, arguments);
    }
    HelpdeskViewMessageController.prototype = new GenericViewController();
    HelpdeskViewMessageController.prototype.viewIndexModel = function (req, res, cb) {

        var self = this;

        var sendInvalidaCredentials = function () {
            cb(null, {
                talkTitle: req.i18n.__("Helpdesk.Talks.Auth.Wellcome.AuthTicketIsNull")
            });
        };

        if (req.user === null) return sendInvalidaCredentials();

        if (req.user === false) return sendInvalidaCredentials();

        req.user = req.user;

        self.helpdeskApiController.talkGetById(req, { idTalk: req.query.idTalk },
            function (e, talkObject) {

                if (e) return cb(e, null);

                if (talkObject.isValid) {
                    cb(null, {
                        talkTitle: talkObject.data.subject
                    });
                }
                else {
                    cb(null, {
                        talkTitle: talkObject.messages.join(' ')
                    });
                }
            });

    };

    function HelpdeskViewLoadDataController() {
        this.helpdeskApiController = new HelpdeskAPIController();
        GenericViewController.apply(this, arguments);
    }
    HelpdeskViewLoadDataController.prototype = new GenericViewController();
    HelpdeskViewLoadDataController.prototype.viewIndexModel = function (req, res, cb) {

        // do nothihg here.
        // this is just for testing purposes on MongoDB

        cb(null, {
            
        });

    };


})(module);