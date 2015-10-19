define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "scripts/modules/crud",
    "../crudCommon/crudSamplesCustomerData.js",
    "../crudCommon/crudSamplesCustomerDefaultOptions.js",
],
   function ($, jqUI, clientApp, crudModule, customerAjax, crudDefaultOptions) {

       clientApp.view = {
           main: function () {

               var crudOptions = jQuery.extend(
                   {},
                   crudDefaultOptions.crudCustomerDefaultOptions(),
                   {
                       gridPagerInit: function () {
                           return {
                               pageSize: 30,
                               pagerTop: {
                                   paginationShow: true,
                                   totalRowsShow: true,
                                   pageSizeShow: true,
                               },
                               //default config for pagerBottom
                               //pagerBottom: {
                               //    paginationShow: true,
                               //    totalRowsShow: true,
                               //    pageSizeShow: true,
                               //}
                           };
                       },
                   });

               jQuery('body')
                   .find('div.ui-customerCrud:first')
                       .crud(crudOptions)
                       .hide()
                       .removeClass('ui-helper-hidden')
                       .fadeIn()
                   .end();


           }
       };

       return clientApp;

   });