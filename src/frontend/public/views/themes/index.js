jQuery('div.ui-themeSelector:first').itemPicker({
    messageBoxSelector: 'div.ui-themeSelector-messages:first',
    itemsSelector: 'ul.ui-themeSelector-list:first > li',
    itemsAttrId: 'data-theme-id',
    itemApllyingMsg: 'Aplicando el tema...',
    itemApllyingFailUnhandledMsg: 'Error no controlado aplicando el tema',
    itemServerPut: function (itemId) {
        return jQuery.ajax({
            url: "/themes/",
            type: "PUT",
            data: JSON.stringify({ newTheme: itemId }),
            cache: false
        });
    },
    itemServerPutOk: function (result) {
        location.reload();
    },
});