define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "helpdesk/common/fakes/helpdeskCommon"
],
function ($, jqUI, clientApp, HelpdeskCommon) {

    var helpdeskCommon = new HelpdeskCommon();

    helpdeskCommon.helpdeskUrls.baseAddress = '/' + globals.domainInfo.virtualDirectory + 'helpdesk/talks/employee/';

    return helpdeskCommon;

});