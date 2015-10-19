define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",

    "scripts/modules/crud",
    "../crudCommon/crudSamplesCustomerData.js",
    "../crudCommon/crudSamplesCustomerDefaultOptions.js",

    "crudProductExtended.AjaxFake.js",
    "crudProductExtended.FilterModel.js",
    "crudProductExtended.FormModel.js",
    "crudProductExtended.GridModel.js",
    "crudProductExtended.Widget.js",
    "crudPage.js",
],
   function ($, jqUI, clientApp) {

       clientApp.view = {
           main: function () {

               jQuery('body')
                   .find('div.ui-crudExtendedSample:first')
                       .crudExtendedSample()
                   .end();
           }
       };

       return clientApp;

   });