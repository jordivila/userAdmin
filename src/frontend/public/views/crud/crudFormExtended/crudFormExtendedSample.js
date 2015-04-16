jQuery(document).ready(function () {

    jQuery('body')
        .find('h1:first')
            .html('Crud - Extended widget')
        .end()
        .find('div.ui-crudExtendedSample:first')
            .crudExtendedSample()
        .end();

});
