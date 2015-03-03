(function ($) {
    jQuery(document).ready(function () {
        VsixMvcAppResult.Widgets.PageOptions.onInit(function () {
            jQuery('div.ui-cirDataEntry:first').cirDataEntry();
        });
    });
})(jQuery);


