define(["jquery", "jqueryui", "scripts/Template.App.ClientApp", "scripts/Template.Widget.ItemPicker"],
   function ($, jqUI, clientApp) {

       clientApp.view = {
           main: function () {

               jQuery('div.ui-languageSelector:first').itemPicker({
                   messageBoxSelector: 'div.ui-languageSelector-messages:first',
                   itemsSelector: 'ul.ui-languageSelector-list:first > li',
                   itemsAttrId: 'data-language-id',
                   itemApllyingMsg: clientApp.i18n.texts.get("Views.Layout.ApplyingChanges"),
                   itemApllyingFailUnhandledMsg: clientApp.i18n.texts.get("Views.Layout.ApplyingChangesError"),
                   itemServerPut: function (itemId) {
                       return jQuery.ajax({
                           url: "/languages/",
                           type: "PUT",
                           data: JSON.stringify({ newValue: itemId }),
                           cache: false
                       });
                   },
                   itemServerPutOk: function (result) {
                       //location.reload();
                       location.href = "/languages/";
                   },
               });

           }
       };

       return clientApp;

   });