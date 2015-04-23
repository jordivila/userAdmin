(function (module) {

    "use strict";

    module.exports = MailMessage;

    var config = require('../libs/config');
    var sendgrid = require('sendgrid')(config.get("mailing:credentials:userName"), config.get("mailing:credentials:password"));

    function MailMessage() {
        this._from = '';
        this._bcc = [];
        this._subject = '';
        this._body = '';
    }

    MailMessage.prototype.From = function (from) {
        if (from) {
            this._from = from;
        }

        return this._from;
    };

    MailMessage.prototype.Bcc = function (emailAddress) {
        if (emailAddress) {
            this._bcc.push(emailAddress);
        }

        return this._bcc;
    };

    MailMessage.prototype.Subject = function (subject) {
        if (subject) {
            this._subject = subject;
        }

        return this._subject;
    };

    MailMessage.prototype.Body = function (body) {
        if (body) {
            this._body = body;
        }

        return this._body;
    };

    MailMessage.prototype.Send = function (cb) {

        var self = this;

        var cbEmailSend = function (err, json) {
            if (err) { cb(err); }

            cb(null, json);
        };

        for (var i = 0; i < self.Bcc().length; i++) {

            var emailOptions = {
                to: self.Bcc()[i],
                from: self.From(),
                subject: self.Subject(),
                text: self.Body(),
                //html: self.Body()
                // for html email purposes use another method
            };

            //console.log("/****************************************************/");
            //console.log("MAIL SENT-->");
            //console.log(emailOptions);
            //console.log("/****************************************************/");

            var email = new sendgrid.Email(emailOptions);

            if (config.get('IsTestEnv') === true) {
                cbEmailSend(null, {});
            }
            else {
                sendgrid.send(email, cbEmailSend);
            }
        }
    };

})(module);