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

               var customerOptions = jQuery.extend({}, crudDefaultOptions.crudCustomerDefaultOptions(), {
                   gridExpand: true,
                   gridPagerInit: function () {
                       return {
                           pageSize: 30,
                       };
                   },
               });



               jQuery('body')
                   .find('div.ui-customerCrud:first')
                       .crud(customerOptions)
                       .hide()
                       .removeClass('ui-helper-hidden')
                       .fadeIn(1, function () {
                           jQuery(this).crud('gridExpandHeightSet');
                       })
                   .end();
           }
       };

       return clientApp;

   });