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

                if (e) return cb(e, null);

                if (dataAuth !== null) {

                    if (dataAuth === false) {

                        cb(null, {
                            WhoYouAreMessage: req.i18n.__('Helpdesk.Talks.Auth.PersonNotFound')
                        });

                    }
                    else {

                        cb(null, {
                            Employees: [dataAuth],
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