
define([
    "jquery",
    "jqueryui",
    "scripts/Template.Widget.Base",
    "scripts/modules/crud",
    "./crudProductExtended.Widget.js",
    "scripts/Template.App.ClientApp",
    "../crudCommon/crudSamplesCustomerDefaultOptions.js",
],
function ($, jqUI, wBase, crudBase, crudExtendedWidget, clientApp, crudDefaultOptions) {


    jQuery.widget("ui.crudExtendedSample", jQuery.ui.widgetBase,
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

            var customerOptions = jQuery.extend({}, crudDefaultOptions.crudCustomerDefaultOptions(), {
                gridFilterVisibleAlways: true,
                gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

                    switch (columnName) {
                        case "nombre":
                            $cell.html('<a href="javascript:void(0);">{0}</a>'.format(dataItem[columnName]));
                            $cell.find('a')
                                .click(function () {
                                    crudGridWidget._trigger('onSelect', null, dataItem);
                                });
                            break;
                        default: break;
                    }
                },
                gridFilterButtonsInit: function (widgetFilter, defaultButtons) {

                    for (var i = 0; i < defaultButtons.length; i++) {
                        if (defaultButtons[i].id == "filter") {
                            defaultButtons[i].text = clientApp.i18n.texts.get("Views.Crud.SearchCustomers");
                        }
                    }

                    defaultButtons.unshift({
                        id: "cancel",
                        text: clientApp.i18n.texts.get("Views.Crud.CrudFormExtended.BackToProducts"),
                        cssClass: "ui-cancel-button",
                        icon: "ui-icon-circle-arrow-w",
                        click: function () {
                            self._pageSet(self._pageViews.products);
                        }
                    });

                    return defaultButtons;
                },
                onCancel: function (e) {
                    self._pageSet(self._pageViews.products);
                },
                onSelect: function (e, dataItem) {
                    jQuery(self.options.productDOMId).product('filterSetCustomer', dataItem);
                    self._pageSet(self._pageViews.products);
                },
            });

            jQuery(self.options.customerDOMId).crud(customerOptions);

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


});