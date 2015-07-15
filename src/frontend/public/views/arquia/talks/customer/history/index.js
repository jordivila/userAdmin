define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",
    "history",

    "scripts/modules/crud",
    "/arquia/talks/customer/arquiaCommon/arquiaCrudFakeData.js",
    "/arquia/talks/customer/arquiaCommon/arquiaCrudDefaultOptions.js",
],
   function ($, jqUI, clientApp, hist, crudModule, customerAjax, crudDefaultOptions) {

       clientApp.View = {
           main: function () {


               var crudOptions = jQuery.extend(
                   {},
                   crudDefaultOptions.crudCustomerDefaultOptions(),
                   {
                       gridPagerInit: function () {
                           return {
                               infiniteScrolling: true
                           };
                       },
                   });


               jQuery('body')
                   .find('div.ui-arquia-talks-summary-crud:first')
                       .crud(crudOptions)
                       .crud('gridButtonsVisible', false)
                       .crud('gridPagerVisible', false)
                       .crud('gridSearch')

                       .hide()
                       .removeClass('ui-helper-hidden')
                       .fadeIn()
                   .end()
                   .find('i.ui-arquia-talks-summary-userIcon:first')
                        .click(function () {
                            History.pushState(null, null, 'add');
                        })
                   .end();
           }
       };

       return clientApp;

   });




















