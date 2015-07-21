define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",
    "/arquia/talks/customer/arquiaCommon/arquiaUrls.js",
],
function ($, jqUI, clientApp, arquiaUrls) {

    clientApp.view = {
        main: function () {

            var navNext = function () {
                clientApp.template.loadByUrl('../' + arquiaUrls.history());
            };

            jQuery('div.ui-arquia-talks-wellcome-container:first')
                .find('button:first')
                    .button()
                    .click(function () {
                        navNext();
                    })
                .end()
            //.find('i.ui-arquia-talks-wellcome-userIcon')
            //    .click(function () {
            //        navNext();
            //    })
            //.end()
            ;
        }
    };

    return clientApp;

});