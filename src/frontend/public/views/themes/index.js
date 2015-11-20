define(["jquery", "jqueryui", "scripts/Template.App.ClientApp", "scripts/Template.Widget.ItemPicker"],
   function ($, jqUI, clientApp) {

       clientApp.view = {
           main: function (context) {

               var urlDest = "";

               if (context.domainInfo.virtualDirectory === "") {
                   urlDest = "/themes/";
               }
               else {
                   urlDest = "/" + context.domainInfo.virtualDirectory + "themes/";
               }

               jQuery('div.ui-themeSelector:first').itemPicker({
                   messageBoxSelector: 'div.ui-themeSelector-messages:first',
                   itemsSelector: 'ul.ui-themeSelector-list:first > li',
                   itemsAttrId: 'data-theme-id',
                   itemApllyingMsg: clientApp.i18n.texts.get("Views.Layout.ApplyingChanges"),
                   itemApllyingFailUnhandledMsg: clientApp.i18n.texts.get("Views.Layout.ApplyingChangesError"),
                   itemServerPut: function (itemId) {
                       return jQuery.ajax({
                           url: urlDest,
                           type: "PUT",
                           data: JSON.stringify({ newValue: itemId }),
                           cache: false
                       });
                   },
                   itemServerPutOk: function (result) {
                       //location.reload();
                       location.href = urlDest;
                   },
               });


           }
       };

       return clientApp;

   });
