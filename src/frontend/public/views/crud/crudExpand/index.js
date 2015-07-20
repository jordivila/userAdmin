define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",

    "scripts/modules/crud",

    "/crud/crudCommon/crudSamplesCustomerData.js",
    "/crud/crudCommon/crudSamplesCustomerDefaultOptions.js",

],
   function ($, jqUI, clientApp, crudModule, customerAjax, crudDefaultOptions) {

       clientApp.view = {
           main: function () {

               var customerOptions = jQuery.extend({}, crudDefaultOptions.crudCustomerDefaultOptions(), {
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
                       .fadeIn()
                   .end();

               var $gridControl = jQuery('div.ui-crudCrud-gridControl:first');

               var gridControlResize = function () {

                   function convertEmToPixels(value) {
                       return value * (parseFloat(getComputedStyle(document.documentElement).fontSize));
                   }

                   $gridControl.height(jQuery(window).height() - convertEmToPixels(11.7));
               };

               jQuery(window)
                   .resize(function (e, ui) {
                       gridControlResize();
                   });

               gridControlResize();

           }
       };

       return clientApp;

   });