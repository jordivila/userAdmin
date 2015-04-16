(function(module) {

    "use strict";

    module.exports.cantAccessYourAccount = cantAccessYourAccount;
    module.exports.resetPassword = resetPassword;

    var util = require('util');
    var DataResultModel = require('../models/dataResult');
    var ErrorHandledModel = require('../models/errorHandled');
    var MailMessage = require('../models/mailMessage');

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

        return cb(null, {});
    }



})(module);