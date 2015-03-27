jQuery('div.ui-crudGridSimple:first')
    .find('div.ui-customerCrud:first')
        .crud(crudCustomerDefaultOptions())
        .crud('gridButtonsVisible', false)
        .crud('gridPagerVisible', false)
        .crud('gridSearch')

        .hide()
        .removeClass('ui-helper-hidden')
        .fadeIn()
    .end();


