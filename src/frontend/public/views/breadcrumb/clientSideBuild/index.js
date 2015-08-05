define([
    "scripts/Template.App.ClientApp",
],
function (clientApp) {

    clientApp.view = {
        breadcrumb: function () {

            return [{
                "title": clientApp.i18n.texts.get("Back.To.Home"),
                "url": "/home/"
            }];

        },
        main: function () {

        }
    };

    return clientApp;

});
