define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",


    "scripts/modules/crud",
    "/crud/crudCommon/crudSamplesCustomerData.js",
    "/crud/crudCommon/crudSamplesCustomerDefaultOptions.js",

],
   function ($, jqUI, clientApp, crudModule, customerAjax, crudOptions) {

       clientApp.view = {
           main: function () {

               var customOptions = jQuery.extend({}, crudOptions.crudCustomerDefaultOptions(), {
                   gridCustomOptions: {
                       texts: {
                           gridFirstTime: "This is a hardcoded message. Esto es un texto 'hardcoded'",
                           gridEmptyData: "This is a hardcoded message. Esto es un texto 'hardcoded'",
                       },
                   }
               });

               jQuery('body')
                   .find('div.ui-customerCrud:first')
                       .crud(customOptions)
                       .crud('gridButtonsVisible', false)
                       .crud('gridPagerVisible', false)
                       //.crud('gridSearch')

                       .hide()
                       .removeClass('ui-helper-hidden')
                       .fadeIn()
                   .end();
           }
       };

       return clientApp;

   });