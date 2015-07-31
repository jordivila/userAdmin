define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "scripts/modules/crud",
    "/crud/crudCommon/crudSamplesCustomerData.js",
    "/crud/crudCommon/crudSamplesCustomerDefaultOptions.js",
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
                               pageSize: 100,
                               infiniteScrolling: true,
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
