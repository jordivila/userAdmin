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




        jQuery(self.options.customerDOMId).customer({
            title: 'Búsqueda de clientes',
            onCancel: function (e) {
                self._pageSet(self._pageViews.products);
            },
            onSelect: function (e, dataItem) {
                jQuery(self.options.productDOMId).product('filterSetCustomer', dataItem);
                self._pageSet(self._pageViews.products);
            },
            done: function () {

                jQuery(self.options.productDOMId).product({
                    title: 'Productos - Entrada de información adicional',
                    onSearchCustomer: function () {
                        self._pageSet(self._pageViews.customers);
                    },
                    done: function () {
                        self._pageSet(self._pageViews.products);
                    }
                });

            }
        });

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

        jQuery(self.options.customerDOMId).hide().removeClass('ui-hidden');
        jQuery(self.options.productDOMId).hide().removeClass('ui-hidden');

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