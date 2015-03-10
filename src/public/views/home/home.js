(function ($) {
    jQuery(document).ready(function () {
        VsixMvcAppResult.Widgets.PageOptions.onInit(function () {
            jQuery('div.ui-cirDataEntry:first').cirDataEntry();






            jQuery('div.ui-themeCrud:first')
                .each(function () {

                    var $themesCrud = jQuery(this);


                    $themesCrud.crud(jQuery.extend({}, crudThemeOptions(), {
                        onSelect: function (e, dataItem) {
                            var cssUri = '//ajax.googleapis.com/ajax/libs/jqueryui/1/themes/{0}/jquery-ui.css'.format(dataItem.name);

                            $themesCrud.crud('progressShow');

                            jQuery.ajax({
                                url: cssUri,
                                type: "GET",
                                dataType: "text",
                                data: {}
                            })
                            .done(function (data, textStatus, jqXHR) {
                                jQuery('#jQueryUITheme').attr('href', cssUri);
                            })
                            .fail(function (jqXHR, textStatus, errorThrown) {

                            })
                            .always(function () {
                                $themesCrud.crud('progressHide');
                            });
                        },
                    }));

                    $themesCrud
                        .find('div.ui-crudFilter-buttons')
                            .find('button.ui-search-button')
                                .click();


                });




        });
    });
})(jQuery);