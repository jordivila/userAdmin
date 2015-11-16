(function (module) {

    "use strict";

    module.exports = HelpdeskViewMessageController;


    var config = require('../libs/config');
    var HelpdeskApiController = require('./' + config.get('helpdesk:controllerType'));
    var helpdeskApiController = new HelpdeskApiController();

    var GenericViewController = require('./classes/genericView');
    var _ = require("underscore");

    function HelpdeskViewMessageController() {
        GenericViewController.apply(this, arguments);
    }
    HelpdeskViewMessageController.prototype = new GenericViewController();
    HelpdeskViewMessageController.prototype.viewIndexModel = function (req, res, cb) {

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

                        req.user = dataAuth;

                        helpdeskApiController.talkGetById(req, { idTalk: req.query.idTalk },
                            function (e, talkObject) {

                                if (e) return cb(e, null);

                                if (talkObject.isValid) {
                                    cb(null, {
                                        helpdeskMessageViewModel: {
                                           talkTitle: talkObject.data.subject
                                        },
                                    });
                                }
                                else {
                                    cb(null, {
                                        helpdeskMessageViewModel: {
                                            talkTitle: talkObject.data.subject
                                        },
                                    });

                                }
                            });


                    }
                }
                else {
                    cb(null, {
                        WhoYouAreMessage: req.i18n.__('Helpdesk.Talks.Auth.Wellcome.AuthTicketIsNull')
                    });
                }
            });


        //req.params.apiEndpointType = req.route.path.indexOf('helpdesk/talks/customer/home') > -1 ? 'customer' : 'employee';

        //helpdeskApiController.reqCredentialsCheck(req, '', '',
        //    function (e, dataAuth) {

        //        if (e) return cb(e, null);

        //        if (dataAuth !== null) {

        //            if (dataAuth === false) {

        //                cb(null, {
        //                    WhoYouAreMessage: req.i18n.__('Helpdesk.Talks.Auth.PersonNotFound')
        //                });

        //            }
        //            else {

        //                req.user = dataAuth;

        //                helpdeskApiController.talkGetById(req, { idTalk: req.query.idTalk },
        //                    function (e, talkObject) {

        //                        if (e) return cb(e, null);

        //                        console.log(talkObject);

        //                        if (talkObject.isValid) {
        //                            cb(null, {
        //                                talkTitle: talkObject.data.title
        //                            });
        //                        }
        //                        else {
        //                            cb(null, {
        //                                talkTitle: talkObject.messages.join(' - ')
        //                            });

        //                        }
        //                    });

        //            }
        //        }
        //        else {
        //            cb(null, {
        //                WhoYouAreMessage: req.i18n.__('Helpdesk.Talks.Auth.Wellcome.AuthTicketIsNull')
        //            });
        //        }
        //    });
    };

})(module);