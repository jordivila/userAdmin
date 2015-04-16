(function(module) {

    "use strict";

    var mongoose = require('mongoose');


    var TokenTempSchema = new mongoose.Schema({
        guid: {
            type: String,
            unique: true,
            required: true
        },
        destroyDate: {
            type: Date,
            required: true
        },
        jsonObject: {
            type: String,
            required: true
        }

    });

    module.exports = mongoose.model('TokenTemp', TokenTempSchema);

})(module);