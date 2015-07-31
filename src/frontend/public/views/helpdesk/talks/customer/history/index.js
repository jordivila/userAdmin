define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",

    "scripts/modules/crud",
    "/helpdesk/talks/customer/helpdeskCommon/helpdeskCrudFakeData.js",
    "/helpdesk/talks/customer/helpdeskCommon/helpdeskUrls.js",
],
function ($, jqUI, clientApp, crudModule, crudAjaxOpts, helpdeskUrls) {

    clientApp.view = {
        main: function () {

            var initMain = function () {

                clientApp.globalizer.get()
                 .done(function (Globalize) {

                     var crudOptions = function () {

                         var r = {
                             //filterModel: [

                             //],
                             gridSearchMethod: crudAjaxOpts.ajax.talkSearch,
                             gridModel: function () {
                                 return [
                                     {
                                         key: "subject",
                                         displayName: clientApp.i18n.texts.get("Helpdesk.Talks.History.GridColumns.Subject")
                                     },
                                     {
                                         key: "dateLastMessage",
                                         displayName: clientApp.i18n.texts.get("Helpdesk.Talks.History.GridColumns.Date")
                                     }
                                 ];
                             }(),
                             gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

                                 switch (columnName) {
                                     case "subject":
                                         $cell.html('<a href="javascript:void(0);">{0}</a>'.format(dataItem[columnName]));
                                         $cell.find('a')
                                             .click(function () {
                                                 clientApp.template.loadByUrl('{0}{1}'.format(helpdeskUrls.baseAddress, helpdeskUrls.message(dataItem.idTalk)));
                                             });
                                         break;
                                     case "dateLastMessage":


                                              var strDate = dataItem[columnName] !== null ? Globalize.formatDate(dataItem[columnName]) : '';
                                              var strUnread = '<div class="ui-text-circle {0}">{1}</div>'.format(
                                                  dataItem.nMessagesUnread > 0 ? 'ui-state-active' : 'ui-helper-invisible',
                                                  dataItem.nMessagesUnread);

                                              $cell.html(strDate + strUnread);



                                         break;
                                     default: break;
                                 }
                             },
                             gridButtonsGet: function (self, defaultButtons) {
                                 for (var i = 0; i < defaultButtons.length; i++) {
                                     if (defaultButtons[i].id == "search") {
                                         defaultButtons[i].text = clientApp.i18n.texts.get("Helpdesk.Talks.History.SearchMessages");
                                     }
                                 }

                                 return defaultButtons;
                             },
                             gridPagerInit: function () {
                                 return {
                                     pageSize: 50,
                                     infiniteScrolling: true
                                 };
                             },
                             formInit: function (self, formOptions) {

                             },
                         };

                         return r;
                     }();

                     jQuery('body')
                         .find('div.ui-helpdesk-talks-summary-crud:first')
                             .crud(crudOptions)
                             .crud('gridButtonsVisible', false)
                             .crud('gridSearch')
                             .hide()
                             .removeClass('ui-helper-hidden')
                             .fadeIn()
                         .end()
                         .find('i.ui-helpdesk-talks-summary-userIcon:first')
                             .click(function () {
                                 clientApp.template.loadByUrl('{0}{1}'.format(helpdeskUrls.baseAddress, helpdeskUrls.subject()));
                             })
                         .end();


                 });


            };

            setTimeout(function () {
                initMain();
            },500);
        }
    };

    return clientApp;

});
