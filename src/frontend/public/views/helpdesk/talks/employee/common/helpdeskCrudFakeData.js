define([
    "/helpdesk/talks/common/fakes/helpdeskCrudFakeData.js",
],
    function (crudAjaxOpts) {

        crudAjaxOpts.apiRoutes = {
            talkSearch: "/api/helpdesk/employee/talk/search",
            talkAdd: "/api/helpdesk/employee/talk/add",
            messageAdd: "/api/helpdesk/employee/message/add",
            messageGetAll: "/api/helpdesk/employee/message/getAll",
            messageGetUnread: "/api/helpdesk/employee/message/getUnread",

            talkGetById: "/api/helpdesk/employee/talk/getById",
            talkSavedByEmployee: "/api/helpdesk/employee/talk/savedByEmployee",
            customerSearch: "/api/helpdesk/employee/customer/search",
            employeeSearch: "/api/helpdesk/employee/employee/search"
        };

        return crudAjaxOpts;

    });