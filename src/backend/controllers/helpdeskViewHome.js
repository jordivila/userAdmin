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

        helpdeskApiController.reqCredentialsCheck(req, '', '',
            function (e, dataAuth) {


                console.log("dataAuth");
                console.log(dataAuth);

                cb(null, {
                    //Customers: customers.data.data,
                    Employees: [dataAuth]
                });


            });

    };

})(module);