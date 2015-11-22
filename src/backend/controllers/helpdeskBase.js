(function (module) {

    "use strict";

    var HelpdeskUserType = {
        customer: 'customer',
        employee: 'employee'
    };


    module.exports.HelpdeskBaseController = HelpdeskBaseController;
    module.exports.HelpdeskUserType = HelpdeskUserType;
    module.exports.HelpdeskViewUnAuthController = HelpdeskViewUnAuthController;

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


    function HelpdeskBaseController() {

    }
    HelpdeskBaseController.prototype._employeeDefaultGet = function (i18n, customerIdPeople, cb) {
        cb(new Error("Not implemented exception"), null);
    };
    HelpdeskBaseController.prototype._talkSave = function (i18n, idTalk, subject, customerId, employeeId, cb) {
        cb(new Error("Not implemented exception"), null);
    };
    HelpdeskBaseController.prototype._talkSearchByCustomer = function (req, params, cb) {
        cb(new Error("Not implemented exception"), null);
    };
    HelpdeskBaseController.prototype._talkSearchByEmployee = function (req, params, cb) {
        cb(new Error("Not implemented exception"), null);
    };
    HelpdeskBaseController.prototype._fakeDataGridTalkGetByIdForEdit = function (req, idTalk, cb) {
        cb(new Error("Not implemented exception"), null);
    };
    HelpdeskBaseController.prototype.reqCredentialsCheck = function (req, username, password, cb) {
        cb(new Error("Not implemented exception"), null);
    };
    HelpdeskBaseController.prototype.isAuthenticated = function (req, res, next) {
        cb(new Error("Not implemented exception"), null);
    };
    HelpdeskBaseController.prototype.testMethodInitDb = function (i18n, cb) {
        cb(new Error("Not implemented exception"), null);
    };
    HelpdeskBaseController.prototype.talkSearch = function (req, params, cb) {

        var self = this;

        if (!req.user.isEmployee) {
            self._talkSearchByCustomer(req, params, cb);
        }
        else {
            self._talkSearchByEmployee(req, params, cb);
        }

    };
    HelpdeskBaseController.prototype.talkAdd = function (req, dataItem, cb) {

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
    HelpdeskBaseController.prototype.messageAdd = function (req, dataItem, cb) {
        cb(new Error("Not implemented exception"), null);
    };
    HelpdeskBaseController.prototype.messageGetAll = function (req, params, cb) {
        cb(new Error("Not implemented exception"), null);
    };
    HelpdeskBaseController.prototype.messageGetUnread = function (req, params, cb) {
        cb(new Error("Not implemented exception"), null);
    };
    /************************************************************
                        Methods for employee
    *************************************************************/
    HelpdeskBaseController.prototype.talkGetById = function (req, dataItem, cb) {

        var dataResult = null;


        this._fakeDataGridTalkGetByIdForEdit(req, dataItem.idTalk,
            function (e, dataResult) {
                if (e) return cb(e, null);

                cb(null, dataResult);

            });
    };
    HelpdeskBaseController.prototype.talkSavedByEmployee = function (req, dataItem, cb) {

        var self = this;

        self._talkSave(
            req.i18n,
            dataItem.isNew === true ? null : dataItem.formData.idTalk,
            dataItem.formData.subject,
            dataItem.formData.customerInfo.customerId, // customerId
            req.user.idPeople, //employeeId
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
    HelpdeskBaseController.prototype.customerSearch = function (req, params, cb) {
        cb(new Error("Not implemented exception"), null);
    };
    HelpdeskBaseController.prototype.employeeSearch = function (req, params, cb) {
        cb(new Error("Not implemented exception"), null);
    };



    function HelpdeskViewUnAuthController() {
        GenericViewController.apply(this, arguments);
    }
    HelpdeskViewUnAuthController.prototype = new GenericViewController();
    HelpdeskViewUnAuthController.prototype.viewIndexModel = function (req, res, cb) {

        this.deleteCookie(res, "oAuthTicket");

        cb(null, {});
    };



})(module);