

VsixMvcAppResult.Ajax.UserMenu(
    function (data, textStatus, jqXHR) {

        jQuery('ul.ui-menuTreeSample:first')
            .menuTree({
                dataBound: function (e) {
                    jQuery(this).hide().removeClass('ui-helper-hidden').show('blind');
                },
                selected: function (e, liData) {
                    console.log(liData);
                }
            })
            .menuTree('bind', data);
    },
    function (jqXHR, textStatus, errorThrown) {

    },
    function (jqXHR, textStatus, errorThrown) {

    });