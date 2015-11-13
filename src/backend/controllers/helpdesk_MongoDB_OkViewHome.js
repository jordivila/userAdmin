(function (module) {

    "use strict";

    module.exports = HelpdeskViewHomeController;


    var config = require('../libs/config');
    var HelpdeskApiController = require('./' + config.get('helpdesk:controllerType'));
    var helpdeskApiController = new HelpdeskApiController();

    var GenericViewController = require('./classes/genericView');
    var _ = require("underscore");

    function HelpdeskViewHomeController() {
        GenericViewController.apply(this, arguments);
    }
    HelpdeskViewHomeController.prototype = new GenericViewController();
    HelpdeskViewHomeController.prototype.viewIndexModel = function (req, res, cb) {

        helpdeskApiController.testMethodInitDb(function (e, data) {

            var allCustomers = _.filter(data.all, function (elem) { return elem.isEmployee === false; });
            var allEmployees = _.filter(data.all, function (elem) { return elem.isEmployee === true; });

            cb(null, {
                Customers: allCustomers,
                Employees: allEmployees,
                WhoYouAreMessage: req.i18n.__('Helpdesk.Talks.Employee.Wellcome.SelectFakeUser')
            });

        });


    };

})(module);