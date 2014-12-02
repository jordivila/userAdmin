var mongoose    = require('mongoose');
var log         = require('../libs/log')(module);
var config      = require('../libs/config');


mongoose.connect(process.env.CUSTOMCONNSTR_MONGOLAB_URI || config.get('mongoose:uri'));

var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

module.exports.mongoose = mongoose;