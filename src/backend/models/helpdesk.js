(function (module) {

    "use strict";

    // Load required packages
    var mongoose = require('mongoose');
    var bcrypt = require('bcrypt-nodejs');
    var uuid = require('node-uuid');


    /*********************************************************

    HelpdeskTalk

    ***********************************************************/

    // Define our user schema
    var HelpdeskTalk = new mongoose.Schema({
        idTalk: {
            type: String,
            //required: true, // this should be required. Added at .pre('save' 
        },
        subject: {
            type: String,
            required: true
        },
        dateLastMessage: {
            type: Date,
            default: Date.now
        }
    });



    HelpdeskTalk.pre('save', function (next) {

        this.idTalk = uuid.v4();

        next();
    });


    module.exports.HelpdeskTalk = mongoose.model('HelpdeskTalk', HelpdeskTalk);





    /*********************************************************

    HelpdeskPeople

    ***********************************************************/

    // Define our user schema
    var HelpdeskPeople = new mongoose.Schema({
        idPeople: {
            type: String,
            //required: true, // this should be required. Added at .pre('save' 
        },
        isEmployee: {
            type: Boolean,
            required: true
        },
        idPersonBackOffice: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    });


    HelpdeskPeople.pre('save', function (next) {

        this.idPeople = uuid.v4();

        next();
    });

    module.exports.HelpdeskPeople = mongoose.model('HelpdeskPeople', HelpdeskPeople);


    /*********************************************************

    HelpdeskMessage

    ***********************************************************/

    // Define our user schema
    var HelpdeskMessage = new mongoose.Schema({
        idMessage: {
            type: String,
            //required: true, // this should be required. Added at .pre('save' 
        },
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

    HelpdeskMessage.pre('save', function (next) {

        this.idMessage = uuid.v4();

        next();
    });


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

    module.exports.HelpdeskPeopleInvolved = mongoose.model('HelpdeskPeopleInvolved', HelpdeskPeopleInvolved);

})(module);