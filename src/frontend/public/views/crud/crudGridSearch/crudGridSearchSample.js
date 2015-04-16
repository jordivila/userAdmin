jQuery(document).ready(function () {

    jQuery('body')
        .find('h1:first')
            .html('Crud widget - Grid search & paginate')
        .end()
        .find('div.ui-customerCrud:first')
            .crud(crudCustomerDefaultOptions())

            .hide()
            .removeClass('ui-helper-hidden')
            .fadeIn()
        .end();

});
