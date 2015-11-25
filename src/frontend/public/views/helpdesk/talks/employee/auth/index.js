define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "helpdesk/employee/common/helpdeskCommon",
    "crossLayer/config"
],
function ($, jqUI, clientApp, helpdeskCommon, crossLayer) {

    clientApp.view = {
        main: function (context) {


            clientApp.template.loadByUrl(context.viewModel.location);

        }
    };

    return clientApp;

});