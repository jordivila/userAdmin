define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "scripts/Template.Widget.ItemPicker"
],
function ($, jqUI, clientApp) {

    clientApp.view = {
        main: function () {

            jQuery('div.ui-currencySelector:first').itemPicker({
                messageBoxSelector: 'div.ui-currencySelector-messages:first',
                itemsSelector: 'ul.ui-currencySelector-list:first > li',
                itemsAttrId: 'data-currency-id',
                itemApllyingMsg: clientApp.i18n.texts.get("Views.Layout.ApplyingChanges"),
                itemApllyingFailUnhandledMsg: clientApp.i18n.texts.get("Views.Layout.ApplyingChangesError"),
                itemServerPut: function (itemId) {
                    return jQuery.ajax({
                        url: "/currencies/",
                        type: "PUT",
                        data: JSON.stringify({ newValue: itemId }),
                        cache: false
                    });
                },
                itemServerPutOk: function (result) {
                    //location.reload();
                    location.href = "/currencies/";
                },
            });
        }
    };

    return clientApp;
});