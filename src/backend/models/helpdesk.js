(function (module) {

    "use strict";

    // Load required packages
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');


    /*********************************************************

    HelpdeskTalk

    ***********************************************************/

    // Define our user schema
    var HelpdeskTalk = new mongoose.Schema({
        subject: {
            type: String,
            required: true
        },
    });


    HelpdeskTalk
        .virtual('idTalk')
        .get(function () {
            return this.id;
        });

    // Export the Mongoose model
    module.exports.HelpdeskTalk = mongoose.model('HelpdeskTalk', HelpdeskTalk);





    /*********************************************************

    HelpdeskPeople

    ***********************************************************/

    // Define our user schema
    var HelpdeskPeople = new mongoose.Schema({
        isEmployee: {
            type: Boolean,
            required: true
        },
        idPersonBackoffice: {
            type: Number,
            required: true
        }
    });


    HelpdeskPeople
        .virtual('idPeople')
        .get(function () {
            return this.id;
        });

    // Export the Mongoose model
    module.exports.HelpdeskPeople = mongoose.model('HelpdeskPeople', HelpdeskPeople);


    /*********************************************************

    HelpdeskMessage

    ***********************************************************/

    // Define our user schema
    var HelpdeskMessage = new mongoose.Schema({
        idTalk: {
            type: String,
            required: true
        },
        idPeople: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        datePosted: {
            type: Date,
            default: Date.now
        },
    });


    HelpdeskMessage
        .virtual('idMessage')
        .get(function () {
            return this.id;
        });

    // Export the Mongoose model
    module.exports.HelpdeskMessage = mongoose.model('HelpdeskMessage', HelpdeskMessage);


    /*********************************************************

    HelpdeskPeopleLastRead

    ***********************************************************/

    // Define our user schema
    var HelpdeskPeopleLastRead = new mongoose.Schema({
        idTalk: {
            type: String,
            required: true
        },
        idPeople: {
            type: String,
            required: true
        },
        idMessage: {
            type: String,
            required: true
        },
        dateRead: {
            type: Date,
            required: true
        }
    });


    //HelpdeskPeopleLastRead
    //    .virtual('idPeople')
    //    .get(function () {
    //        return this.id;
    //    });

    // Export the Mongoose model
    module.exports.HelpdeskPeopleLastRead = mongoose.model('HelpdeskPeopleLastRead', HelpdeskPeopleLastRead);


    /*********************************************************

    HelpdeskPeopleInvolved

    ***********************************************************/

    // Define our user schema
    var HelpdeskPeopleInvolved = new mongoose.Schema({
        idTalk: {
            type: String,
            required: true
        },
        idPeople: {
            type: String,
            required: true
        },
        dateAdded: {
            type: Date,
            default: Date.now
        }
    });


    //HelpdeskPeopleInvolved
    //    .virtual('idPeople')
    //    .get(function () {
    //        return this.id;
    //    });

    // Export the Mongoose model
    module.exports.HelpdeskPeopleInvolved = mongoose.model('HelpdeskPeopleInvolved', HelpdeskPeopleInvolved);

})(module);