define([
    "jquery",
    "jqueryui",
    "scripts/Template.Widget.HelpdeskChat",
    "scripts/Template.App.ClientApp",
    "scripts/Template.Class.UrlHelper",
    "/helpdesk/talks/employee/common/helpdeskCommon.js",
    "/helpdesk/talks/employee/common/helpdeskCrudFakeData.js",
],
function ($, jqUI, HelpdeskChatWidget, clientApp, UrlHelper, helpdeskCommon, crudAjaxOpts) {

    clientApp.view = {
        breadcrumb: function () {

            return [{
                "title": clientApp.i18n.texts.get("Helpdesk.Talks.Summary.Title"),
                "url": "{0}{1}".format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.history())
            }];

        },
        main: function () {

            jQuery('#employeeHelpdeskChat')
                .helpdeskChat({
                    idTalk: function () {

                        var idTalk = new UrlHelper().query.parsed.idTalk;

                        if (idTalk === undefined) {
                            console.error(new Error('Argument exception: missing idTalk from query string'));
                        }

                        return new UrlHelper().query.parsed.idTalk;

                    }(),
                    talkTitle: clientApp.i18n.texts.get("Helpdesk.Talks.Message.Title"),
                    talkDescription: clientApp.i18n.texts.get("Helpdesk.Talks.Message.Description"),
                    messageAdd: crudAjaxOpts.ajax.messageAdd,
                    messageGetAll: crudAjaxOpts.ajax.messageGetAll,
                    messageGetUnread: crudAjaxOpts.ajax.messageGetUnread,
                });
        }
    };

    return clientApp;

});