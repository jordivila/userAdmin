define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",


    "scripts/modules/crud",
    "/crud/crudCommon/crudSamplesCustomerData.js",
    "/crud/crudCommon/crudSamplesCustomerDefaultOptions.js",

],
   function ($, jqUI, clientApp, crudModule, customerAjax, crudOptions) {

       clientApp.View = {
           main: function () {

               var customerOptions = jQuery.extend({}, crudOptions.crudCustomerDefaultOptions(), {
                   gridFilterVisibleAlways: true,
                   gridFilterButtonsInit: function (widgetFilter, defaultButtons) {
                       for (var i = 0; i < defaultButtons.length; i++) {
                           if (defaultButtons[i].id == "filter") {
                               defaultButtons[i].text = clientApp.i18n.texts.get("Views.Crud.SearchCustomers");
                           }
                       }
                       return defaultButtons;
                   },
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