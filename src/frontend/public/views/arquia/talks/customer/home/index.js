define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",
    "history",
],
function ($, jqUI, clientApp, hist) {

    clientApp.View = {
        main: function () {

            jQuery('div.ui-arquia-talks-wellcome-container:first')
                .find('button:first')
                    .button()
                    .click(function () {
                        History.pushState(null, null, '../history/');
                    });
        }
    };

    return clientApp;

});