(function (module) {

    "use strict";

    module.exports = HelpdeskViewAuthController;


    var config = require('../libs/config');
    var HelpdeskApiController = require('./' + config.get('helpdesk:controllerType'));
    var helpdeskApiController = new HelpdeskApiController();

    var GenericViewController = require('./classes/genericView');
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