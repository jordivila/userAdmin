(function(module) {

    "use strict";

    // Load required packages
    var mongoose = require('mongoose');

    // Define our role schema
    var UsersInRolesSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        roleId: {
            type: String,
            required: true
        }
    });

    // Export the Mongoose model
    module.exports = mongoose.model('UsersInRoles', UsersInRolesSchema);

})(module);