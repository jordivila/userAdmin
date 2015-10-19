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

               var customerOptions = jQuery.extend({}, crudDefaultOptions.crudCustomerDefaultOptions(), {
                   gridExpand: true,
                   gridExpandHeightCalc: function ($widget) {
                       return clientApp.utils.convertEmToPixels(10);
                   },
                   gridPagerInit: function () {
                       return {
                           pageSize: 30,
                       };
                   },
               });



               jQuery('body')
                   .find('div.ui-customerCrud:first')
                       .crud(customerOptions)
                       .hide()
                       .removeClass('ui-helper-hidden')
                       .fadeIn(1, function () {

                           var $widget = jQuery(this);

                           //setTimeout(function () {

                               jQuery($widget).crud('gridExpandHeightSet');

                           //}, 1000);
                       })
                   .end();
           }
       };

       return clientApp;

   });