define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.ClientApp",
    "scripts/modules/crud",
    "./crudProductExtended.AjaxFake.js",
    "./crudProductExtended.FormModel.js",
    "./crudProductExtended.GridModel.js",
    "./crudProductExtended.FilterModel.js"
],
function ($, jqUI, clientApp, wCrud, productAjax, productFormModelGet, productGridModelGet, productFilterModelGet) {

    jQuery.widget("ui.product", jQuery.ui.crud,
    {
        options: {
            filterModel: productFilterModelGet(this),
            gridFilterButtonsInit: function (widgetFilter, defaultButtons) {

                for (var i = 0; i < defaultButtons.length; i++) {
                    if (defaultButtons[i].id == "filter") {
                        defaultButtons[i].text = clientApp.i18n.texts.get("Views.Crud.SearchProducts");
                    }
                }

                return defaultButtons;
            },
            gridFilterVisibleAlways: true,
            gridSearchMethod: productAjax.ajax.productSearch,
            gridSearchForEditMethod: productAjax.ajax.productSearchForEdit,
            gridButtonsGet: function (crudWidget, defaultButtons) {
                for (var i = 0; i < defaultButtons.length; i++) {
                    if (defaultButtons[i].id == "search") {
                        defaultButtons[i].text = clientApp.i18n.texts.get("Views.Crud.SearchProducts");
                    }
                }
                return defaultButtons;
            },
            gridModel: productGridModelGet(),
            gridViewCellBound: function (crudGridWidget, $row, $cell, dataItem, columnName) {
                switch (columnName) {
                    case "productId":

                        $cell.html('<a href="javascript:void(0);">{0}</a>'.format(dataItem[columnName]));
                        $cell.find('a')
                            .click(function () {
                                crudGridWidget._trigger('onEdit', null, dataItem);
                            });

                        break;
                    case "fechaDesde":

                        clientApp.globalizer.get()
                         .done(function (Globalize) {

                             $cell.html(dataItem.fechaDesde !== null ? Globalize.formatDate(dataItem.fechaDesde) : '');

                         });

                        break;
                    default: break;
                }
            },
            formInit: function (crudWidget, $parent) {

                var tBasicInfo = '' +
                    '<div class="ui-productCrud-form-searchOutput">' +
                        '<h3 class="ui-state-default">' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.BasicInfo")) + '</h3>' +
                        '<div data-fielditem="productId" data-fielditem-name="' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.ProductNum")) + '"></div>' +
                        '<div data-fielditem="productTypeDesc" data-fielditem-name="' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.ProductTypeDescColumn")) + '"></div>' +
                        '<div data-fielditem="nombre" data-fielditem-name="' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.Name_BussinesName")) + '"></div>' +
                        '<div data-fielditem="fechaDesde" data-fielditem-name="' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.DateFrom")) + '"></div>' +
                        '<div data-fielditem="fechaHasta" data-fielditem-name="' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.DateTo")) + '"></div>' +
                    '</div>' +
                    '<div class="ui-productCrud-form-type">' +
                        '<h3 class="ui-state-default">' + clientApp.utils.htmlEncode(clientApp.i18n.texts.get("Views.Crud.CrudExtended.DetailInfo")) + '</h3>' +
                    '</div>';

                jQuery($parent).prepend(tBasicInfo);
            },
            formButtonsGet: function (self, defaultButtons) {
                return defaultButtons;
            },
            formBind: function (self, dataItem) {

                clientApp.globalizer.get()
                 .done(function (Globalize) {

                     jQuery(self.element)
                         .find('div.ui-productCrud-form-searchOutput')
                             .find('div[data-fieldItem="productId"]').html(dataItem.productId)
                             .end()
                             .find('div[data-fieldItem="nombre"]').html(dataItem.nombre)
                             .end()
                             .find('div[data-fieldItem="productTypeDesc"]').html(dataItem.productTypeDesc)
                             .end()
                             .find('div[data-fieldItem="fechaDesde"]').html(dataItem.fechaDesde !== null ? Globalize.formatDate(dataItem.fechaDesde) : '')
                             .end()
                             .find('div[data-fieldItem="fechaHasta"]').html(dataItem.fechaHasta !== null ? Globalize.formatDate(dataItem.fechaHasta) : '')
                             .end();
                      
                 });

            },
            formSaveMethod: productAjax.ajax.productSave,
            formValueGet: function (self, currentValue) {
                return currentValue;
            },
            formModel: productFormModelGet(),
        },
        _create: function () {

            this._super();
        },
        _init: function () {
            this._super();
        },
        destroy: function () {
            this._super();
        },
        filterSetCustomer: function (custInfo) {
            for (var i = 0; i < this.options.filterModel.length; i++) {
                if (this.options.filterModel[i].id == "customerId") {
                    this.options.filterModel[i].input.onItemBind(jQuery(this.element), custInfo);
                }
            }

        },
        filterSearchCustomer: function () {
            this._trigger('onSearchCustomer', null, null);
        },
    });

});