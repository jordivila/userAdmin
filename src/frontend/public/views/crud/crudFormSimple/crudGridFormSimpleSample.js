


var customerOptions = jQuery.extend({}, crudCustomerDefaultFormOptions(), {
    gridFilterVisibleAlways: true,
});

jQuery('body')
    .find('h1:first')
        .html('Crud - Simple form')
    .end()
    .find('div.ui-customerCrud:first')
        .crud(customerOptions)
        .hide()
        .removeClass('ui-helper-hidden')
        .fadeIn()
    .end();
