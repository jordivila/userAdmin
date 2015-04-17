var mongoose    = require('mongoose');
var log         = require('../libs/log')(module);
var config      = require('../libs/config');



function dbInit(cb)
{
    //mongoose.connect(process.env.CUSTOMCONNSTR_MONGOLAB_URI || config.get('mongoose:uri'));
    mongoose.connect(config.get('mongoose:uri'));

    //var db = mongoose.connection;

    mongoose.connection.on('error', function (err) {
        log.error('connection error:', err.message);
    });

    mongoose.connection.on('open', function callback() {
        log.info("Connected to DB!");

        cb(null, cb(mongoose.connection));
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

}

module.exports.dbInit = dbInit;