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

               var customerOptions = jQuery.extend({}, crudDefaultOptions.crudCustomerDefaultFormOptions(), {
                   gridFilterVisibleAlways: true,
               });

               jQuery('body')
                   .find('div.ui-customerCrud:first')
                       .crud(customerOptions)
                       .hide()
                       .removeClass('ui-helper-hidden')
                       .fadeIn()
                   .end();


           }
       };

       return clientApp;

   });
