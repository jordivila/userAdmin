define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "/helpdesk/talks/customer/common/helpdeskUrls.js",
],
function ($, jqUI, clientApp, helpdeskUrls) {

    clientApp.view = {
        main: function () {

            var navNext = function () {
                console.log('{0}{1}'.format(helpdeskUrls.baseAddress, helpdeskUrls.history()));
                clientApp.template.loadByUrl('{0}{1}'.format(helpdeskUrls.baseAddress, helpdeskUrls.history()));
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
                .end();
        }
    };

    return clientApp;

});