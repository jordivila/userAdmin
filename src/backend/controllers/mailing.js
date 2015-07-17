(function (module) {

    "use strict";

    module.exports.testEmail = testEmail;
    module.exports.createNewAccount = createNewAccount;
    module.exports.cantAccessYourAccount = cantAccessYourAccount;
    module.exports.resetPassword = resetPassword;


    var util = require('util');
    var DataResultModel = require('../../crossLayer/models/dataResult');
    var ErrorHandledModel = require('../../crossLayer/models/errorHandled');
    var MailMessage = require('../models/mailMessage');
    var config = require('../libs/config');

    function testEmail(req, cb) {
        try {
            var i18n = req.i18n;
            var mailMessage = new MailMessage();
            mailMessage.From(config.get('mailing:supportEmailAddress'));
            mailMessage.Bcc(config.get('mailing:supportEmailAddress'));
            mailMessage.Subject("test mail");
            mailMessage.Body("this is a sample email message");
            mailMessage.Send(function (err, mailResult) {
                if (err) cb(err);

                cb(null, mailResult);
            });
        } catch (errMailing) {
            return cb(errMailing);
        }
    }

    function cantAccessYourAccount(req, activateFormVirtualPath, user, token, cb) {

        var i18n = req.i18n;

        try {

            var mailMessage = new MailMessage();
            mailMessage.From(config.get('mailing:supportEmailAddress'));
            mailMessage.Bcc(user.email);
            mailMessage.Subject(util.format('%s: %s',
                config.get('domainInfo:domainName'),
                i18n.__("AccountResources.CantAccessYourAccount_EmailTitle")));


            var backUri = util.format('%s://%s%s/%s',
                config.get('domainInfo:secutiryProtocol'),
                config.get('domainInfo:domainName'),
                activateFormVirtualPath,
                token.guid);

            mailMessage.Body(
                util.format(i18n.__("AccountResources.CantAccessYourAccount_Email"),
                    backUri,
                    config.get('domainInfo:domainName')
                ));

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

            return cb(new ErrorHandledModel(i18n.__("GeneralTexts.NotImplemented")));
        }

        return cb(null, resultData);
    }

    function createNewAccount(req, user, token, cb) {

        try {
            var i18n = req.i18n;
            var mailMessage = new MailMessage();
            mailMessage.From(config.get('mailing:supportEmailAddress'));
            mailMessage.Bcc(user.email);
            mailMessage.Subject(i18n.__("AccountResources.CreateNewAccount_EmailSubject"));
            mailMessage.Body(i18n.__("AccountResources.CreateNewAccount_EmailBody"));
            mailMessage.Send(function (err, mailResult) {
                if (err) cb(err);

                cb(null, mailResult);
            });
        } catch (errMailing) {
            return cb(errMailing);
        }
    }


})(module);