(function (module) {

    "use strict";

    module.exports = HelpdeskViewAuthController;


    var GenericViewController = require('./classes/genericView');
    var HelpdeskApiController = require('./helpdesk');
    var helpdeskApiController = new HelpdeskApiController();
    var _ = require("underscore");

    function HelpdeskViewAuthController() {
        GenericViewController.apply(this, arguments);
    }
    HelpdeskViewAuthController.prototype = new GenericViewController();
    HelpdeskViewAuthController.prototype.viewIndexModel = function (req, res, cb) {

        this.setCookie(res, "oAuthTicket", req.query.oAuthTicket);

        res.writeHead(301,
          {
              Location: '../home/'// + newRoom
          }
        );
        res.end();


        //cb(null, {});
    };

})(module);