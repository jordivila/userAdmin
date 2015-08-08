define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "/helpdesk/talks/employee/common/helpdeskCommon.js",

    "scripts/modules/crud",
    "/crud/crudCommon/crudSamplesCustomerData.js",
    "/crud/crudCommon/crudSamplesCustomerDefaultOptions.js",

    "./crudProductExtended.AjaxFake.js",
    "./crudProductExtended.FilterModel.js",
    "./crudProductExtended.FormModel.js",
    "./crudProductExtended.GridModel.js",
    "./crudProductExtended.Widget.js",
    "./crudPage.js",
],
   function ($, jqUI, clientApp, helpdeskCommon) {

       clientApp.view = {
           breadcrumb: function () {

               return [{
                   "title": clientApp.i18n.texts.get("Helpdesk.Talks.Wellcome.Title"),
                   "url": "{0}{1}".format(helpdeskCommon.helpdeskUrls.baseAddress, helpdeskCommon.helpdeskUrls.home)
               }];

           },

           main: function () {

               helpdeskCommon.methods.setTitleWiki();

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

                               var $gridControl = jQuery(this).find('div.ui-productCrud:first').find('div.ui-crudGrid-body:first');

                               var gridControlResize = function () {
                                   $gridControl.height(jQuery(window).height() - clientApp.utils.convertEmToPixels(24.4));
                               };


                               // WARNING !!!!!! Make it widget & Unbind event on destroy !!!! 

                               jQuery(window)
                                   .resize(function (e, ui) {
                                       gridControlResize();
                                   });

                               gridControlResize();

                            });
                   });








           }
       };

       return clientApp;

   });