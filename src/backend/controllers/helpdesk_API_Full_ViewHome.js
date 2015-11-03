(function (module) {

    "use strict";

    module.exports = HelpdeskViewHomeController;


    var GenericViewController = require('./classes/genericView');
    var HelpdeskApiController = require('./helpdesk');
    var helpdeskApiController = new HelpdeskApiController();
    var _ = require("underscore");

    function HelpdeskViewHomeController() {
        GenericViewController.apply(this, arguments);
    }
    HelpdeskViewHomeController.prototype = new GenericViewController();
    HelpdeskViewHomeController.prototype.viewIndexModel = function (req, res, cb) {

        var params = {};
        params.filter = {};
        params.page = 0;
        params.pageSize = 1000;

        helpdeskApiController.customerSearch(req, params, function (e, customers) {

            if (e) return cb(e);

            for (var i = 0; i < customers.data.data.length; i++) {
                customers.data.data[i].idPeople = customers.data.data[i].customerId;
                customers.data.data[i].name = customers.data.data[i].customerName;
            }

            helpdeskApiController.employeeSearch(req, params, function (e, employees) {

                if (e) return cb(e);

                for (var i = 0; i < employees.data.data.length; i++) {
                    employees.data.data[i].idPeople = employees.data.data[i].employeeId;
                    employees.data.data[i].name = employees.data.data[i].employeeName;
                }


                cb(null, {
                    Customers: customers.data.data,
                    Employees: employees.data.data
                });
            });
        });

    };

})(module);