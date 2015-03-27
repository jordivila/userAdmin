jQuery('div.ui-crudGridSearch:first')
    .find('div.ui-customerCrud:first')
        .crud(crudCustomerDefaultOptions())

        .hide()
        .removeClass('ui-helper-hidden')
        .fadeIn()
    .end();