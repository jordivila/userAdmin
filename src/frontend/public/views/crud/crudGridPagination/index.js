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

               var crudOptions = jQuery.extend(
                   {},
                   crudCustomerDefaultOptions(),
                   {
                       gridPagerInit: function () {
                           return {
                               pageSize: 30,
                               pagerTop: {
                                   paginationShow: true,
                                   totalRowsShow: true,
                                   pageSizeShow: true,
                               },
                               //default config for pagerBottom
                               //pagerBottom: {
                               //    paginationShow: true,
                               //    totalRowsShow: true,
                               //    pageSizeShow: true,
                               //}
                           };
                       },
                   });

               jQuery('body')
                   .find('h1:first')
                       .html('Crud widget - Grid pagination config')
                   .end()
                   .find('div.ui-customerCrud:first')
                       .crud(crudOptions)

                       .hide()
                       .removeClass('ui-helper-hidden')
                       .fadeIn()
                   .end();


           }
       };

       return clientApp;

   });