define(["jquery", "jqueryui", "scripts/Template.App.Init", "scripts/Template.Widget.ItemPicker"],
   function ($, jqUI, clientApp) {

       clientApp.View = {
           main: function () {


               jQuery('div.ui-themeSelector:first').itemPicker({
                   messageBoxSelector: 'div.ui-themeSelector-messages:first',
                   itemsSelector: 'ul.ui-themeSelector-list:first > li',
                   itemsAttrId: 'data-theme-id',
                   itemApllyingMsg: clientApp.i18n.texts.get("Views.Layout.ApplyingChanges"),
                   itemApllyingFailUnhandledMsg: clientApp.i18n.texts.get("Views.Layout.ApplyingChangesError"),
                   itemServerPut: function (itemId) {
                       return jQuery.ajax({
                           url: "/themes/",
                           type: "PUT",
                           data: JSON.stringify({ newValue: itemId }),
                           cache: false
                       });
                   },
                   itemServerPutOk: function (result) {
                       //location.reload();
                       location.href = "/themes/";
                   },
               });


           }
       };

       return clientApp;

   });
