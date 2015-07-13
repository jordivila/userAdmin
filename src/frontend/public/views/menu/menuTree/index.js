define(["jquery", "jqueryui", "scripts/Template.App.Init", "scripts/Template.App.Ajax.Init", "scripts/Template.Widget.Menu.tree"],
   function ($, jqUI, clientApp) {

       clientApp.View = {
           main: function () {

               clientApp.ajax.UserMenu(function (err, data) {

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
