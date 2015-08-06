define([
    "jquery",
    "jqueryui",
    "scripts/Template.Widget.HelpdeskChat",
    "scripts/Template.App.ClientApp",
    "scripts/Template.Class.UrlHelper",
    "/helpdesk/talks/customer/helpdeskCommon/helpdeskUrls.js",
    "/helpdesk/talks/customer/helpdeskCommon/helpdeskCrudFakeData.js",
],
function ($, jqUI, HelpdeskChatWidget, clientApp, UrlHelper, helpdeskUrls, crudAjaxOpts) {

    clientApp.view = {
        breadcrumb: function () {

            return [{
                "title": clientApp.i18n.texts.get("Helpdesk.Talks.Summary.Title"),
                "url": "{0}{1}".format(helpdeskUrls.baseAddress, helpdeskUrls.history())
            }];

        },
        main: function () {

            jQuery('#customerHelpdeskChat')
                .helpdeskChat({
                    idTalk: function () {

                        var idTalk = new UrlHelper().query.parsed.idTalk;

                        if (idTalk === undefined) {
                            console.error(new Error('Argument exception: missing idTalk from query string'));
                        }

                        return parseInt(new UrlHelper().query.parsed.idTalk);

                    }(),
                    talkTitle: clientApp.i18n.texts.get("Helpdesk.Talks.Message.Title"),
                    talkDescription: clientApp.i18n.texts.get("Helpdesk.Talks.Message.Description"),
                    messageAdd: crudAjaxOpts.ajax.messageAdd,
                    messageGetAll: crudAjaxOpts.ajax.messageGetAll,
                    messageGetUnread: crudAjaxOpts.ajax.messageGetUnread,
                });

            jQuery('div.ui-breadcrumb:first')
                .addClass('ui-widget-header')
                .removeClass('ui-state-default');
        }
    };

    return clientApp;

});
