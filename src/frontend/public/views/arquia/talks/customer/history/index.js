define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",
    "history",

    "scripts/modules/crud",
    "/arquia/talks/customer/arquiaCommon/arquiaCrudFakeData.js",
    "/arquia/talks/customer/arquiaCommon/arquiaCrudDefaultOptions.js",
],
   function ($, jqUI, clientApp, hist, crudModule, customerAjax, crudOptions) {

       clientApp.View = {
           main: function () {

               jQuery('body')
                   .find('div.ui-arquia-talks-summary-crud:first')
                       .crud(crudOptions.crudCustomerDefaultOptions())
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







               $(window).scroll(function () {
                   if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                       console.log("cargando......");

                       $(window).unbind('scroll');

                       //$('div#loadmoreajaxloader').show();

                       //$.ajax({
                       //    url: "loadmore.php",
                       //    success: function (html) {
                       //        if (html) {
                       //            $("#postswrapper").append(html);
                       //            $('div#loadmoreajaxloader').hide();
                       //        } else {
                       //            $('div#loadmoreajaxloader').html('<center>No more posts to show.</center>');
                       //        }
                       //    }
                       //});


                   }
               });

















           }
       };

       return clientApp;

   });




















