(function(module) {

    "use strict";

    // Load required packages
    var mongoose = require('mongoose');

    // Define our role schema
    var RoleSchema = new mongoose.Schema({
        name: {
            type: String,
            unique: true,
            required: true
        }
    });


    RoleSchema
        .virtual('roleId')
        .get(function() {
            return this.id;
        });

    // Export the Mongoose model
    module.exports = mongoose.model('Role', RoleSchema);

})(module);