define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",

    "scripts/modules/crud",
    "/uicontrols/crud/crudSamplesCustomerData.js",
    "/uicontrols/crud/crudSamplesCustomerDefaultOptions.js",

    "crudProductExtended.AjaxFake.js",
    "crudProductExtended.FilterModel.js",
    "crudProductExtended.FormModel.js",
    "crudProductExtended.GridModel.js",
    "crudProductExtended.Widget.js",
    "crudPage.js",
],
   function ($, jqUI, VsixMvcAppResult) {

       VsixMvcAppResult.View = {
           main: function () {

               jQuery('body')
                   .find('h1:first')
                       .html('Crud - Extended widget')
                   .end()
                   .find('div.ui-crudExtendedSample:first')
                       .crudExtendedSample()
                   .end();

           }
       };

       return VsixMvcAppResult;

   });