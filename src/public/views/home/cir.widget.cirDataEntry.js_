/// <reference path="inv.ajax.js" />
/// <reference path="../../Common/Scripts/ArquiaBackOffice.Widget.Dialogs.js" />


jQuery.widget("ui.cirDataEntry", jQuery.ui.commonBaseWidget,
{
    options: {
        customerDOMId: null,
        productDOMId: null
    },
    _create: function () {

        this._super();

        this.options.customerDOMId = jQuery(this.element).find('div.ui-customerCrud');
        this.options.productDOMId = jQuery(this.element).find('div.ui-productCrud');
    },
    _init: function () {

        this._super();

        var self = this;




        var customerOptions = jQuery.extend({}, crudCustomerOptions(), {
            onCancel: function (e) {
                self._pageSet(self._pageViews.products);
            },
            onSelect: function (e, dataItem) {
                jQuery(self.options.productDOMId).product('filterSetCustomer', dataItem);
                self._pageSet(self._pageViews.products);
            },
        });

        jQuery(self.options.customerDOMId).crud(customerOptions);


        //jQuery(self.options.customerDOMId).customer({
        //    onCancel: function (e) {
        //        self._pageSet(self._pageViews.products);
        //    },
        //    onSelect: function (e, dataItem) {
        //        jQuery(self.options.productDOMId).product('filterSetCustomer', dataItem);
        //        self._pageSet(self._pageViews.products);
        //    },
        //});

        jQuery(self.options.productDOMId).product({
            onSearchCustomer: function () {
                self._pageSet(self._pageViews.customers);
            },
        });

        self._pageSet(self._pageViews.products);


    },
    destroy: function () {

        this._super();
    },
    _pageViews: {
        products: 1,
        customers: 2
    },
    _pageSet: function (pageView) {

        var self = this;

        jQuery(self.options.customerDOMId).hide().removeClass('ui-helper-hidden');
        jQuery(self.options.productDOMId).hide().removeClass('ui-helper-hidden');

        switch (pageView) {
            case self._pageViews.customers:
                jQuery(self.options.customerDOMId).fadeIn();
                break;
            case self._pageViews.products:
                jQuery(self.options.productDOMId).fadeIn();
                break;
            default: break;
        }
    }
});