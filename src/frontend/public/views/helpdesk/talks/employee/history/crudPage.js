
define([
    "jquery",
    "jqueryui",
    "scripts/Template.Widget.Base",
    "scripts/crud/common.widget.crud",
    "./crudProductExtended.Widget.js",
    "scripts/Template.App.ClientApp",
    "../common/crudSamplesCustomerDefaultOptions.js",
    "../common/crudSamplesEmployeeDefaultOptions.js",
],
function ($, jqUI, wBase, crudBase, crudExtendedWidget, clientApp, crudDefaultOptionsCustomer, crudDefaultOptionsEmployee) {


    jQuery.widget("ui.crudExtendedSample", jQuery.ui.widgetBase,
    {
        options: {
            customerDOMId: null,
            productDOMId: null,
            employeeDOMId: null
        },
        _create: function () {

            this._super();

            this.options.customerDOMId = jQuery(this.element).find('div.ui-customerCrud');
            this.options.productDOMId = jQuery(this.element).find('div.ui-productCrud');
            this.options.employeeDOMId = jQuery(this.element).find('div.ui-employeeCrud');
        },
        _init: function () {

            this._customerCrudInit();
            this._employeeCrudInit();
            this._productCrudInit();
            this._bindResize();

            this._super();
        },
        destroy: function () {

            jQuery(window).unbind('resize');

            this._super();
        },
        _pageViews: {
            products: 1,
            customers: 2,
            employees:3
        },
        _pageSet: function (pageView) {

            var self = this;

            jQuery(self.options.customerDOMId).hide().removeClass('ui-helper-hidden');
            jQuery(self.options.productDOMId).hide().removeClass('ui-helper-hidden');
            jQuery(self.options.employeeDOMId).hide().removeClass('ui-helper-hidden');

            switch (pageView) {
                case self._pageViews.customers:
                    jQuery(self.options.customerDOMId).fadeIn();
                    break;
                case self._pageViews.products:
                    jQuery(self.options.productDOMId).fadeIn();
                    break;
                case self._pageViews.employees:
                    jQuery(self.options.employeeDOMId).fadeIn();
                    break;
                default: break;
            }
        },
        _productCrudInit: function () {
            var self = this;

            jQuery(self.options.productDOMId).product({
                onSearchCustomer: function () {
                    self._pageSet(self._pageViews.customers);
                },
                onSearchEmployee: function () {
                    self._pageSet(self._pageViews.employees);
                },
            });

            self._pageSet(self._pageViews.products);
        },
        _customerCrudInit: function () {

            var self = this;

            var customerOptions = jQuery.extend({}, crudDefaultOptionsCustomer.crudCustomerDefaultOptions(), {
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
                        text: clientApp.i18n.texts.get("GeneralTexts.BackToFilter"),
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
        },
        _employeeCrudInit: function () {

            var self = this;

            var employeeOptions = jQuery.extend({}, crudDefaultOptionsEmployee.crudEmployeeDefaultOptions(), {
                gridFilterVisibleAlways: true,
                gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {

                    switch (columnName) {
                        case "employeeName":
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
                            defaultButtons[i].text = clientApp.i18n.texts.get("Helpdesk.Talks.SearchEmployees");
                        }
                    }

                    defaultButtons.unshift({
                        id: "cancel",
                        text: clientApp.i18n.texts.get("GeneralTexts.BackToFilter"),
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
                    jQuery(self.options.productDOMId).product('filterSetEmployee', dataItem);
                    self._pageSet(self._pageViews.products);
                },
            });

            jQuery(self.options.employeeDOMId).crud(employeeOptions);
        },
        _bindResize: function () {

            var $gridControl = jQuery(this).find('div.ui-productCrud:first').find('div.ui-crudGrid-body:first');

            var $gridControlCustomerDOMId = jQuery(this.options.customerDOMId).find('div.ui-crudGrid-body:first');
            var $gridControlProductDOMId= jQuery(this.options.productDOMId).find('div.ui-crudGrid-body:first');
            var $gridControlEmployeeDOMId = jQuery(this.options.employeeDOMId).find('div.ui-crudGrid-body:first');


            var gridControlResize = function () {

                $gridControlProductDOMId.height(jQuery(window).height() - clientApp.utils.convertEmToPixels(20.4));
                $gridControlCustomerDOMId.height(jQuery(window).height() - clientApp.utils.convertEmToPixels(28.4));
                $gridControlEmployeeDOMId.height(jQuery(window).height() - clientApp.utils.convertEmToPixels(28.4));
            };

            jQuery(window)
                .resize(function (e, ui) {
                    gridControlResize();
                });

            gridControlResize();


        },
    });


});