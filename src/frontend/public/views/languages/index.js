define(["jquery", "jqueryui", "scripts/Template.App.Init", "scripts/Template.Widget.ItemPicker"],
   function ($, jqUI, clientApp) {

       clientApp.View = {
           main: function () {

               jQuery('div.ui-languageSelector:first').itemPicker({
                   messageBoxSelector: 'div.ui-languageSelector-messages:first',
                   itemsSelector: 'ul.ui-languageSelector-list:first > li',
                   itemsAttrId: 'data-language-id',
                   itemApllyingMsg: 'Aplicando idioma...',
                   itemApllyingFailUnhandledMsg: 'Error no controlado aplicando el idioma',
                   itemServerPut: function (itemId) {
                       return jQuery.ajax({
                           url: "/languages/",
                           type: "PUT",
                           data: JSON.stringify({ newValue: itemId }),
                           cache: false
                       });
                   },
                   itemServerPutOk: function (result) {
                       location.reload();
                   },
               });

           }
       };

       return clientApp;

   });