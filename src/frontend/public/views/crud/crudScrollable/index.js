define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",


    "scripts/modules/crud",
    "/crud/crudCommon/crudSamplesCustomerData.js",
    "/crud/crudCommon/crudSamplesCustomerDefaultOptions.js",

],
   function ($, jqUI, clientApp) {

       clientApp.View = {
           main: function () {

               var customerOptions = jQuery.extend({}, crudCustomerDefaultOptions(), {
                   gridFilterVisibleAlways: true,
               });

               jQuery('body')
                   .find('h1:first')
                       .html('Crud widget - Grid scrollable (javascript)')
                   .end()
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