define([
    "scripts/Template.App.ClientApp",
],
function (clientApp) {

    clientApp.view = {
        breadcrumb: function () {

            return [{
                "title": clientApp.i18n.texts.get("GeneralTexts.BackToPreviousPage"),
                "url": function () { History.back(); return false; }
            }];

        },
        main: function () {

        }
    };

    return clientApp;

});
