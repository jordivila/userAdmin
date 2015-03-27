jQuery('div.ui-crudGridSearch:first')
    .find('div.ui-customerCrud:first')
        .crud(crudCustomerDefaultOptions())
        .crud('gridSearch')

        .hide()
        .removeClass('ui-helper-hidden')
        .fadeIn()
    .end();