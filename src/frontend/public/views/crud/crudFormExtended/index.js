define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",

    "scripts/modules/crud",
    "/crud/crudCommon/crudSamplesCustomerData.js",
    "/crud/crudCommon/crudSamplesCustomerDefaultOptions.js",

    "/crud/crudFormExtended/crudProductExtended.AjaxFake.js",
    "/crud/crudFormExtended/crudProductExtended.FilterModel.js",
    "/crud/crudFormExtended/crudProductExtended.FormModel.js",
    "/crud/crudFormExtended/crudProductExtended.GridModel.js",
    "/crud/crudFormExtended/crudProductExtended.Widget.js",
    "/crud/crudFormExtended/crudPage.js",
],
   function ($, jqUI, clientApp) {

       clientApp.View = {
           main: function () {

               jQuery('body')
                   .find('div.ui-crudExtendedSample:first')
                       .crudExtendedSample()
                   .end();
           }
       };

       return clientApp;

   });