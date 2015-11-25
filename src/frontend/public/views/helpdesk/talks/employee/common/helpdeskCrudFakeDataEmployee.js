define([
    "helpdesk/common/fakes/helpdeskCrudFakeData",
],
    function (CrudAjaxOpts) {

        var crudAjaxOpts = new CrudAjaxOpts();

        crudAjaxOpts.apiRoutes = {
            talkSearch: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/employee/talk/search",
            talkAdd: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/employee/talk/add",
            messageAdd: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/employee/message/add",
            messageGetAll: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/employee/message/getAll",
            messageGetUnread: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/employee/message/getUnread",

            talkGetById: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/employee/talk/getById",
            talkSavedByEmployee: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/employee/talk/savedByEmployee",
            customerSearch: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/employee/customer/search",
            employeeSearch: "/" + globals.domainInfo.virtualDirectory + "api/helpdesk/employee/employee/search"
        };

        return crudAjaxOpts;

    });