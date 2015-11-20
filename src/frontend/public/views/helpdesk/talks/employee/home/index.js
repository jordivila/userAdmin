define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "helpdesk/employee/common/helpdeskCommonEmployee",
    "crossLayer/config"
],
function ($, jqUI, clientApp, helpdeskCommon, crossLayer) {

    clientApp.view = {
        main: function (context) {

            var navNext = function () {
                clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.history()));
            };

            jQuery('div.ui-helpdesk-talks-wellcome-container:first')
                .find('button:first')
                    .button()
                    .click(function () {
                        navNext();
                    })
                .end()
                .find('i.ui-helpdesk-talks-wellcome-userIcon')
                    .click(function () {
                        navNext();
                    })
                .end()
                .find('div.ui-helpdesk-needHelp')
                    .click(function () {
                        clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.wiki()));
                    })
                .end()
                .removeClass('ui-helper-hidden');
        }
    };

    return clientApp;

});