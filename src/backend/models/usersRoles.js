(function(module) {

    "use strict";

    var mongoose = require('mongoose');

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