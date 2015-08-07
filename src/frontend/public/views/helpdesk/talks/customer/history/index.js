define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",

    "scripts/modules/crud",
    "/helpdesk/talks/common/fakes/helpdeskCrudFakeData.js",
    "/helpdesk/talks/customer/common/helpdeskCommon.js",
    "crossLayer/dateHelper"
],
function ($, jqUI, clientApp, crudModule, crudAjaxOpts, helpdeskCommon, dateHelper) {

    clientApp.view = {
        breadcrumb: function () {

            return [{
                "title": clientApp.i18n.texts.get("Helpdesk.Talks.Wellcome.Title"),
                "url": "{0}{1}".format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.home)
            }];

        },
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
                                                 clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.message(dataItem.idTalk)));
                                             });
                                         break;
                                     case "dateLastMessage":

                                         var dateDescr = function () {

                                             var diff = dateHelper.getDifferenceDays(new Date(), dataItem[columnName]);
                                             if (diff === 0) {
                                                 return Globalize.formatDate(dataItem[columnName], { time: "short" });
                                             }
                                             else {
                                                 return Globalize.formatDate(dataItem[columnName], { date: "short" });
                                             }

                                         };

                                         var strDate = dataItem[columnName] !== null ? dateDescr() : '';
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
                             gridCustomOptions: {
                                 texts: {
                                     gridEmptyData: clientApp.i18n.texts.get("Helpdesk.Talks.History.EmptyData"),
                                 },
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
                                 clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.subject()));
                             })
                         .end();


                     helpdeskCommon.methods.setTitleWiki();
                 });

            };

            setTimeout(function () {
                initMain();
            }, 200);
        }
    };

    return clientApp;

});
