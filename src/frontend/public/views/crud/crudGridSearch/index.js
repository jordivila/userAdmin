define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",


    "scripts/modules/crud",
    "/uicontrols/crud/crudSamplesCustomerData.js",
    "/uicontrols/crud/crudSamplesCustomerDefaultOptions.js",

],
   function ($, jqUI, VsixMvcAppResult) {

       VsixMvcAppResult.View = {
           main: function () {

               jQuery('body')
                   .find('h1:first')
                       .html('Crud widget - Grid search & paginate')
                   .end()
                   .find('div.ui-customerCrud:first')
                       .crud(crudCustomerDefaultOptions())

                       .hide()
                       .removeClass('ui-helper-hidden')
                       .fadeIn()
                   .end();


           }
       };

       return VsixMvcAppResult;

   });