define(["jquery", "jqueryui", "scripts/Template.App.Init", "scripts/Template.App.Ajax.Init", "scripts/Template.Widget.Menu.slides"],
   function ($, jqUI, clientApp) {

       clientApp.view = {
           main: function () {

               clientApp.ajax.userMenu(function (err, data) {

                   if (err === null)
                   {
                       jQuery('div.ui-menuSlidesSample:first')
                           .menuSlides({
                               dataBound: function (e) {
                                   jQuery(this).hide().removeClass('ui-helper-hidden').show('blind');
                               },
                               selected: function (e, liData) {
                                   console.log(liData);
                               }
                           })
                           .menuSlides('bind', data);
                   }

               });

           }
       };

       return clientApp;

   });