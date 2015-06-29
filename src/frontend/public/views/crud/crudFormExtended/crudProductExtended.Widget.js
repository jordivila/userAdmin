define([
    "jquery",
    "jqueryui",
    "scripts/Template.App.Init",
    "scripts/crud/common.widget.crud",
    "./crudProductExtended.AjaxFake.js"
],
function ($, jqUI, clientApp, wCrud, productAjax) {

    jQuery.widget("ui.product", jQuery.ui.crud,
    {
        options: {
            filterModel: productFilterModelGet(this),
            gridFilterVisibleAlways: true,
            gridSearchMethod: productAjax.ajax.productSearch,
            gridSearchForEditMethod: productAjax.ajax.productSearchForEdit,
            gridButtonsGet: function (crudWidget, defaultButtons) {
                for (var i = 0; i < defaultButtons.length; i++) {
                    if (defaultButtons[i].id == "search") {
                        defaultButtons[i].text = "Buscar productos";
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

                        clientApp.Globalizer.get()
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
                        '<h3 class="ui-state-default">Información básica</h3>' +
                        '<div data-fielditem="productId" data-fielditem-name="Num. Producto"></div>' +
                        '<div data-fielditem="productTypeDesc" data-fielditem-name="Producto"></div>' +
                        '<div data-fielditem="nombre" data-fielditem-name="Nombre/Razón Social"></div>' +
                        '<div data-fielditem="fechaDesde" data-fielditem-name="Fecha desde"></div>' +
                        '<div data-fielditem="fechaHasta" data-fielditem-name="Fecha hasta"></div>' +
                    '</div>' +
                    '<div class="ui-productCrud-form-type">' +
                        '<h3 class="ui-state-default">Información detallada del préstamo</h3>' +
                    '</div>';

                jQuery($parent).prepend(tBasicInfo);


                //jQuery(crudWidget.options.formDOMId)
                //    .append(tBasicInfo)
                //    .fieldItem();


                //jQuery(crudWidget.options.formDOMId)
                //    .crudForm(jQuery.extend({}, formOptions,
                //        {
                //            formModel: crudWidget.options.formModel,
                //            formButtonsGet: crudWidget.options.formButtonsGet,
                //            formBind: crudWidget.options.formBind,
                //            formValueGet: crudWidget.options.formValueGet,
                //            formSaveMethod: crudWidget.options.formSaveMethod
                //        }));

                //jQuery(crudWidget.options.formDOMId)
                //    .find('div.ui-crudForm-modelBinding:first')
                //        .widgetModel({
                //            modelItems: crudWidget.options.formModel,
                //            errorsCleared: function () {
                //                crudWidget.errorHide();
                //            }
                //        })
                //    .end();



            },
            formButtonsGet: function (self, defaultButtons) {
                return defaultButtons;
            },
            formBind: function (self, dataItem) {

                clientApp.Globalizer.get()
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