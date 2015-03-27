


var customerOptions = jQuery.extend({}, crudCustomerDefaultOptions(), {
    gridFilterVisibleAlways: true,
});

jQuery('div.ui-crudGridSearchDirect:first')
    .find('div.ui-customerCrud:first')
        .crud(customerOptions)
        .hide()
        .removeClass('ui-helper-hidden')
        .fadeIn()
    .end();
