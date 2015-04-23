(function (module) {

    "use strict";

    module.exports.testEmail = testEmail;
    module.exports.cantAccessYourAccount = cantAccessYourAccount;
    module.exports.resetPassword = resetPassword;


    var util = require('util');
    var DataResultModel = require('../models/dataResult');
    var ErrorHandledModel = require('../models/errorHandled');
    var MailMessage = require('../models/mailMessage');
    var config = require('../libs/config');
    var sendgrid = require('sendgrid')(config.get("mailing:credentials:userName"), config.get("mailing:credentials:password"));

    function testEmail(req, cb) {

        try {

            var email = new sendgrid.Email({
                to: 'jordi.vila@gmail.com',
                from: 'jordi.vila@gmail.com',
                subject: 'test mail',
                text: 'This is a sample email message.',
                //html: 'This is a sample <b>HTML<b> email message.'
            });

            sendgrid.send(email, function (err, json) {
                if (err) { cb(err); }

                cb(null, json);
            });

        } catch (errMailing) {
            return cb(errMailing);
        }
    }

    function cantAccessYourAccount(req, activateFormVirtualPath, user, token, cb) {

        var i18n = req.i18n;

        try {

            var mailMessage = new MailMessage();
            mailMessage.From('jordi.vila@gmail.com'); //ApplicationConfiguration.MailingSettingsSection.SupportTeamEmailAddress
            mailMessage.Bcc(user.email);
            mailMessage.Subject(util.format('%s: %s',
                'ApplicationConfiguration.DomainInfoSettingsSection.DomainName',
                i18n.__("AccountResources.CantAccessYourAccount_EmailTitle")));


            var backUri = util.format('%s://%s%s/%s',
                "https", //ApplicationConfiguration.DomainInfoSettingsSection.SecurityProtocol
                "domainname.com", //ApplicationConfiguration.DomainInfoSettingsSection.DomainName
                activateFormVirtualPath,
                token.guid);

            mailMessage.Body(
                util.format(i18n.__("AccountResources.CantAccessYourAccount_Email"),
                    backUri,
                    "domainname.com" //ApplicationConfiguration.DomainInfoSettingsSection.DomainName
                ));

            /*
                using (ISmtpClient smtp = DependencyFactory.Resolve<ISmtpClient>())
                {
                    // Do not use SendAsync -> otherwise transaction could commit without sending mail
                    smtp.Send(mail);
                }

            */

            return cb(null, new DataResultModel(true, i18n.__("AccountResources.CantAccessYourAccount_EmailSent"), {
                userId: user.userId,
                tokenId: token.guid
            }));

        } catch (errMailing) {
            return cb(errMailing);
        }
    }

    function resetPassword(req, user, token, cb) {

        /*
        MailMessage mail = new MailMessage();
        mail.From = new MailAddress(ApplicationConfiguration.MailingSettingsSection.SupportTeamEmailAddress);
        mail.Bcc.Add(new MailAddress(result.Data.User.Email));
        mail.Subject = string.Format(AccountResources.ChangePassword_EmailTitle, ApplicationConfiguration.DomainInfoSettingsSection.DomainName);
        mail.Body = string.Format(AccountResources.ChangePassword_EmailBody, ApplicationConfiguration.DomainInfoSettingsSection.DomainName);

        */


        var resultData = {};

        if (config.get('IsTestEnv') === true) {
            resultData = {
                userId: user.userId,
                tokenId: token.guid
            };
        } else {

            //mailingController.resetPassword(req, user, token, )

            //send token via email

            return cb(new ErrorHandledModel(i18n.__("Not implemented")));
        }

        return cb(null, resultData);
    }

    function activateAccount(req, user, token, cb) {

        /*
        MailMessage mail = new MailMessage();
        mail.From = new MailAddress(ApplicationConfiguration.MailingSettingsSection.SupportTeamEmailAddress);
        mail.Bcc.Add(new MailAddress(result.Data.User.Email));
        mail.Subject = string.Format(AccountResources.ChangePassword_EmailTitle, ApplicationConfiguration.DomainInfoSettingsSection.DomainName);
        mail.Body = string.Format(AccountResources.ChangePassword_EmailBody, ApplicationConfiguration.DomainInfoSettingsSection.DomainName);

        */


        var resultData = {};

        if (config.get('IsTestEnv') === true) {
            resultData = {
                userId: user.userId,
                tokenId: token.guid
            };
        } else {

            //mailingController.resetPassword(req, user, token, )

            //send token via email

            return cb(new ErrorHandledModel(i18n.__("Not implemented")));
        }

        return cb(null, resultData);
    }


})(module);