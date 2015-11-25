define([
    "require",
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "helpdesk/employee/common/helpdeskCommon",
    "helpdesk/employee/history/crudPage",
],
   function (require,$, jqUI, clientApp, helpdeskCommon) {



       clientApp.view = {
           breadcrumb: function () {

               return [{
                   "title": clientApp.i18n.texts.get("Helpdesk.Talks.Wellcome.Title"),
                   "url": "{0}{1}".format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.home)
               }];

           },

           main: function (context) {

               jQuery('div.ui-helpdesk-talks:first')
                   .find('i.ui-helpdesk-talks-summary-userIcon:first')
                       .click(function () {
                           clientApp.template.loadByUrl('{0}{1}'.format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.subject()));
                       })
                   .end()
                   .find('div.ui-crudExtendedSample:first')
                       .crudExtendedSample()
                   .end()
                   .fadeOut(1, function () {
                       jQuery(this)
                           .removeClass('ui-helper-hidden')
                           .fadeIn(1, function () {
                               

                            });
                   });
           }
       };

       return clientApp;

   });