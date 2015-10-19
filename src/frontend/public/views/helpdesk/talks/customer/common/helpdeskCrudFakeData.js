define([
    "../../common/fakes/helpdeskCrudFakeData.js",
],
    function (crudAjaxOpts) {

        crudAjaxOpts.apiRoutes = {
            talkSearch: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/customer/talk/search",
            talkAdd: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/customer/talk/add",
            messageAdd: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/customer/message/add",
            messageGetAll: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/customer/message/getAll",
            messageGetUnread: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/customer/message/getUnread",

            talkGetById: null,
            talkSavedByEmployee: null,
            customerSearch: null,
            employeeSearch: null
        };

        return crudAjaxOpts;

    });