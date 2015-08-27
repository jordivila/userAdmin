define([
    "/helpdesk/talks/common/fakes/helpdeskCrudFakeData.js",
],
    function (crudAjaxOpts) {

        crudAjaxOpts.apiRoutes = {
            talkSearch: "/api/helpdesk/customer/talk/search",
            talkAdd: "/api/helpdesk/customer/talk/add",
            messageAdd: "/api/helpdesk/customer/message/add",
            messageGetAll: "/api/helpdesk/customer/message/getAll",
            messageGetUnread: "/api/helpdesk/customer/message/getUnread",

            talkGetById: null,
            talkSavedByEmployee: null,
            customerSearch: null,
            employeeSearch: null
        };

        return crudAjaxOpts;

    });