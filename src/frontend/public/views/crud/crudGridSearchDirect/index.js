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
                   gridFilterButtonsInit: function (widgetFilter, defaultButtons) {
                       for (var i = 0; i < defaultButtons.length; i++) {
                           if (defaultButtons[i].id == "filter") {
                               defaultButtons[i].text = "Buscar clientes";
                           }
                       }
                       return defaultButtons;
                   },
               });

               jQuery('body')
                   .find('h1:first')
                       .html('Crud widget - Grid search filter on top')
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