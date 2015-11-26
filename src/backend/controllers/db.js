(function (module) {

    "use strict";

    module.exports = DbController;

    var mongoose = require('mongoose');
    var log = require('../controllers/log')(module);
    var config = require('../libs/config');




    function DbController() {

    }
    DbController.prototype._connection = null;
    DbController.prototype.CnnOpen = function (cb) {

        //mongoose.connect(process.env.CUSTOMCONNSTR_MONGOLAB_URI || config.get('mongoose:uri'));
        mongoose.connect(config.get('mongoose:uri'));

        //var db = mongoose.connection;

        mongoose.connection.on('error', function (err) {
            log.error('connection error:', err.message);
        });

        mongoose.connection.on('open', function callback() {

            log.info("Connected to DB!" + config.get('mongoose:uri'));

            cb(null, mongoose.connection);
        });

        // When the connection is disconnected
        mongoose.connection.on('disconnected', function () {
            log.error('Mongoose default connection disconnected');
        });

        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', function () {
            mongoose.connection.close(function () {
                console.log('Mongoose default connection disconnected through app termination');
                process.exit(0);
            });
        });
    };

})(module);