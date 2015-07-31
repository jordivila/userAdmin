define(["jquery", "jqueryui", "scripts/Template.App.ClientApp", "scripts/Template.Class.Ajax", "scripts/Template.Widget.Menu.tree"],
   function ($, jqUI, clientApp) {

       clientApp.view = {
           main: function () {

               clientApp.ajax.userMenu(function (err, data) {

                   if (err === null) {
                       jQuery('ul.ui-menuTreeSample:first')
                            .menuTree({
                                dataBound: function (e) {
                                    jQuery(this).hide().removeClass('ui-helper-hidden').show('blind');
                                },
                                selected: function (e, liData) {
                                    console.log(liData);
                                }
                            })
                            .menuTree('bind', data);
                   }

               });
           }
       };

       return clientApp;

   });
