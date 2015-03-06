(function ($) {
    jQuery(document).ready(function () {
        VsixMvcAppResult.Widgets.PageOptions.onInit(function () {
            jQuery('div.ui-cirDataEntry:first').cirDataEntry();

            jQuery('div.ui-themeCrud').crud(jQuery.extend({}, crudThemeOptions(), {
                onSelect: function (e, dataItem) {
                    var cssUri = '//ajax.googleapis.com/ajax/libs/jqueryui/1/themes/{0}/jquery-ui.css'.format(dataItem.name);

                    jQuery.ajax({
                        url: cssUri,
                        type: "GET",
                        dataType: "script",
                        data: {}
                    })
                    .done(function (data, textStatus, jqXHR) {
                        jQuery('#jQueryUITheme').attr('href', cssUri);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        
                    })
                    .always(function () {
                        
                    });

                },
            }));

            jQuery('div.ui-themeCrud')
                .find('div.ui-crudFilter-buttons')
                    .find('button.ui-search-button')
                        .click();

        });
    });
})(jQuery);