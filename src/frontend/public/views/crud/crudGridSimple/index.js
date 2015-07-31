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

               jQuery('body')
                   .find('div.ui-customerCrud:first')
                       .crud(crudOptions.crudCustomerDefaultOptions())
                       .crud('gridButtonsVisible', false)
                       .crud('gridPagerVisible', false)
                       .crud('gridSearch')

                       .hide()
                       .removeClass('ui-helper-hidden')
                       .fadeIn()
                   .end();
           }
       };

       return clientApp;

   });