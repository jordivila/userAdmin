define(["jquery", "jqueryui", "scripts/Template.App.Init", "scripts/Template.App.Ajax.Init", "scripts/Template.Widget.Menu.slides"],
   function ($, jqUI, VsixMvcAppResult) {

       VsixMvcAppResult.View = {
           main: function () {

               VsixMvcAppResult.Ajax.UserMenu(
                   function (data, textStatus, jqXHR) {

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
                   },
                   function (jqXHR, textStatus, errorThrown) {

                   },
                   function (jqXHR, textStatus, errorThrown) {

                   });

           }
       };

       return VsixMvcAppResult;

   });