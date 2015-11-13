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

        req.params.apiEndpointType = req.route.path.indexOf('helpdesk/talks/customer/home') > -1 ? 'customer' : 'employee';

        helpdeskApiController.reqCredentialsCheck(req, '', '',
            function (e, dataAuth) {

                if (e) return cb(e, null);

                if (dataAuth !== null) {

                    if (dataAuth === false) {

                        cb(null, {
                            WhoYouAreMessage: req.i18n.__('Helpdesk.Talks.Auth.PersonNotFound')
                        });

                    }
                    else {

                        cb(null, {
                            Customers: dataAuth.isEmployee === false ? [dataAuth] : undefined,
                            Employees: dataAuth.isEmployee === true ? [dataAuth] : undefined,
                            WhoYouAreMessage: req.i18n.__('Helpdesk.Talks.Auth.Wellcome.WhoYouAreMessage')
                        });
                    }
                }
                else {
                    cb(null, {
                        WhoYouAreMessage: req.i18n.__('Helpdesk.Talks.Auth.Wellcome.AuthTicketIsNull')
                    });
                }
            });
    };

})(module);